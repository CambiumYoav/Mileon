import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal, computed, effect, AfterViewInit, runInInjectionContext, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { RouterService } from '../../../services/router.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { AuthorityForm } from '../../../types/management/management-form-fileds';
import { ConstPath } from '../../../constants/const_path';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  ReactiveFormsModule,
} from '@angular/forms';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { AuthorityService } from '../../../services/authority.service ';
import { AuthorityManagementService } from '../authority-management.service';
import {
  EXTRA_PORTAL_FIELDS,
  GENERAL_PORTAL_FIELDS,
} from '../../../types/management/authority-portal.fields';
import { SessionService } from '../../../services/session.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { PortalFormsUtils } from '../../../utils/portalForms';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { FormBuilderService } from '../../../services/form-builder.service';
import { AuthorityManagementPortalTableComponent } from '../authority-management-portal-table/authority-management-portal-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-portal',
  templateUrl: './authority-management-portal.component.html',
  styleUrls: ['./authority-management-portal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthorityManagementPortalTableComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})
export class AuthorityManagementPortalComponent implements OnInit, OnDestroy, AfterViewInit {
  private readonly _title = signal<string>(TitlesEnum.AuthorityPortal);
  private readonly _generalTitle = signal<string>(TitlesEnum.PortalGeneralTitle);
  private readonly _extraTitle = signal<string>(TitlesEnum.PortalExtraTitle);
  private readonly _generalData = signal<any[]>(GENERAL_PORTAL_FIELDS);
  private readonly _extraData = signal<any[]>(EXTRA_PORTAL_FIELDS);
  private readonly _currentAuthority = signal<string | null>(null);
  private readonly _settingsData = signal<any>({ Widgets: [] });
  private readonly _widgetDataLength = signal<any>(null);
  private readonly _generalTableSelectedValues = signal<{ [key: string]: string }>({});
  private readonly _extraTableSelectedValues = signal<{ [key: string]: string }>({});
  private readonly _finalPayload = signal<any>(null);
  private readonly _finalUrl = signal<string>('');
  private readonly _isModalOpen = signal<boolean>(false);
  private readonly _saveSuccess = signal<boolean>(false);
  private readonly _hasSubmitted = signal<boolean>(false);

  readonly title = computed(() => this._title());
  readonly generalTitle = computed(() => this._generalTitle());
  readonly extraTitle = computed(() => this._extraTitle());
  readonly generalData = computed(() => this._generalData());
  readonly extraData = computed(() => this._extraData());
  readonly currentAuthority = computed(() => this._currentAuthority());
  readonly settingsData = computed(() => this._settingsData());
  readonly widgetDataLength = computed(() => this._widgetDataLength());
  readonly generalTableSelectedValues = computed(() => this._generalTableSelectedValues());
  readonly extraTableSelectedValues = computed(() => this._extraTableSelectedValues());
  readonly finalPayload = computed(() => this._finalPayload());
  readonly finalUrl = computed(() => this._finalUrl());
  readonly isModalOpen = computed(() => this._isModalOpen());
  readonly saveSuccess = computed(() => this._saveSuccess());
  readonly hasSubmitted = computed(() => this._hasSubmitted());

  readonly Icons = ConstPath;

  form: any;
  dynamicForm!: FormGroup;

  private readonly routerService = inject(RouterService);
  private readonly sessionService = inject(SessionService);
  private readonly modeDetectionService = inject(ModeDetectionService);
  private readonly authorityService = inject(AuthorityService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly toaster = inject(ToastrService);
  private readonly formBuilderService = inject(FormBuilderService);

  private readonly createdAuthority = toSignal(this.sharedDataService.createdAuthority$, { initialValue: null });
  private readonly authorityId = toSignal(this.authorityService.authorityId$, { initialValue: null });
  private readonly injector = inject(Injector);

  constructor() {
    const form = new AuthorityForm();
    this.form = form.PortalAuthorityFields;
  }

  // Move effects to field initializers to ensure they run in injection context
  private readonly createdAuthorityEffect = effect(() => {
    const id = this.createdAuthority();
    if (id) {
      this._currentAuthority.set(id);
    }
  });

  private readonly editModeEffect = effect(() => {
    if (this.isEditMode) {
      const authorityID = this.authorityId();
      if (authorityID) {
        this._currentAuthority.set(authorityID);
        this.getWidgetsSettings();
        this.getAuthoritySubDomain();
      }
    }
  });

  ngOnInit(): void {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementPortalComponent'
    );

    this.createForm();
    const savedData = this.sessionService.get('authorityPortalData');
    const savedDataUrl = this.sessionService.get('authorityPortalSubDomain');
    if (savedDataUrl && savedData && !this.isEditMode) {
      this.getDataFromSession(savedData, savedDataUrl);
      this.removeDataFromSession();
    }

    if (this.isEditMode) {
      this.removeDataFromSession();
    }
  }

  ngAfterViewInit() {
    const urlControl = this.dynamicForm.get('url');
    if (urlControl) {
      runInInjectionContext(this.injector, () => {
        const urlValue = toSignal(urlControl.valueChanges, { initialValue: urlControl.value });
        
        effect(() => {
          const value = urlValue();
          if (value && !value.startsWith('https://')) {
            urlControl.setValue('https://' + value.replace(/^https?:\/\//, ''), {
              emitEvent: false,
            });
          }
        });
      });
    }
  }

  ngOnDestroy() {
    this._hasSubmitted.set(false);
  }

  get isEditMode(): boolean {
    return this.modeDetectionService.getCurrentMode();
  }

  private createForm(): void {
    this.dynamicForm = this.formBuilderService.buildForm(this.form);
  }

  getServerData() {
    const generalValues = PortalFormsUtils.extractServerPayload(
      this.generalData(),
      this.generalTableSelectedValues()
    );
    const extraValues = PortalFormsUtils.extractServerPayload(
      this.extraData(),
      this.extraTableSelectedValues()
    );

    this._finalPayload.set({
      ...generalValues,
      ...extraValues,
    });
  }

  getDataFromSession(portalData: any, urlData: any) {
    const cleanUrl = 'https://' + urlData;
    this.dynamicForm.patchValue({ url: cleanUrl });
    this.patchPortalDataFromSession(portalData);

    this._generalTableSelectedValues.set(
      PortalFormsUtils.buildSelectedValuesFromRows(this.generalData())
    );
    this._extraTableSelectedValues.set(
      PortalFormsUtils.buildSelectedValuesFromRows(this.extraData())
    );
  }
  subdomainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value || '';
      const value = raw.replace(/^https?:\/\//, ''); // הסר prefix

      const valid = /^[a-zA-Z0-9-]+$/.test(value);
      return valid
        ? null
        : { pattern: { actualValue: raw, requiredPattern: '^[a-zA-Z0-9-]+$' } };
    };
  }
  submitForm() {
    this._hasSubmitted.set(true);
    this.dynamicForm.markAllAsTouched();
    if (this.dynamicForm.invalid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      return;
    }
    this._hasSubmitted.set(true);
    const urlControl = this.dynamicForm.get('url')?.value;
    this._finalUrl.set(urlControl?.replace(/^https?:\/\//, ''));

    this.getServerData();

    // Send to server
    this.authorityManagementService
      .updateAuthorityWidgets(this.currentAuthority()!, this.finalPayload())
      .then((res) => {
        this._saveSuccess.set(true);
      })
      .catch((err) => {
        console.error('Update failed', err);
        this._saveSuccess.set(false);
      });

    this.authorityManagementService
      .updateAuthoritySubDomain(this.currentAuthority()!, String(this.finalUrl()))
      .then((res) => {
        if (this.isEditMode) {
          this.toaster.success(
            ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY
          );
        }
        this._saveSuccess.set(true);
      })
      .catch((err) => {
        console.error('Update failed', err);
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS);
        this._saveSuccess.set(false);
      });

    if (!this.isEditMode) {
      this._hasSubmitted.set(false);
      if (this.saveSuccess()) {
        this.navigateToNextForm();
      }
    }
  }

  navigateToNextForm() {
    this.getServerData();
    this.saveDataToSession();
    this.modeDetectionService.navigateToNext(RP.Management.FormsManagement);
  }

  saveDataToSession() {
    const urlControl = this.dynamicForm.get('url')?.value;
    this._finalUrl.set(urlControl?.replace(/^https?:\/\//, ''));
    this.sessionService.set('authorityPortalData', this.finalPayload());

    this.sessionService.set(
      'authorityPortalSubDomain',
      JSON.stringify(this.finalUrl())
    );
  }

  removeDataFromSession() {
    this.sessionService.remove('authorityPortalSubDomain');
    this.sessionService.remove('authorityPortalData');
  }

  back() {
    this.routerService.back();
  }

  onTableValuesChanged(event: {
    tableId: string;
    values: { [key: string]: string };
  }) {
    if (event.tableId === 'table1') {
      this._generalTableSelectedValues.set(event.values);
    } else if (event.tableId === 'table2') {
      this._extraTableSelectedValues.set(event.values);
    }
  }

  async getWidgetsSettings() {
    try {
      const data = await this.authorityManagementService.getAuthorityWidgets(
        this.currentAuthority()!
      );

      this._generalData.set(PortalFormsUtils.patchServerKeys(
        this.generalData(),
        data
      ));
      this._extraData.set(PortalFormsUtils.patchServerKeys(this.extraData(), data));

      const widgetData = PortalFormsUtils.mapWidgetsToSummary(data);

      this._settingsData.set({ Widgets: widgetData });
      this._widgetDataLength.set(Array.from(
        { length: widgetData.length },
        (_, i) => i
      ));
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  }

  async getAuthoritySubDomain() {
    try {
      const res = await this.authorityManagementService.getAuthoritySubDomain(
        this.currentAuthority()!
      );
      if (res && res.success) {
        const cleanUrl = this.cleanUrl(res);
        this.dynamicForm.patchValue({ url: cleanUrl });
      }
    } catch (e) {
      console.error('Error fetching subdomain:', e);
    }
  }

  cleanUrl(url: any): string {
    return url.subDomain?.startsWith('http')
      ? url.subDomain
      : 'https://' + url.subDomain;
  }

  openModal() {
    this._isModalOpen.set(true);
  }

  closeModal() {
    this._isModalOpen.set(false);
  }

  patchPortalDataFromSession(sessionData: any) {
    this._generalData.set(PortalFormsUtils.patchServerKeys(
      this.generalData(),
      sessionData
    ));
    this._extraData.set(PortalFormsUtils.patchServerKeys(
      this.extraData(),
      sessionData
    ));

    const widgetData = PortalFormsUtils.mapWidgetsToSummary(sessionData);
    this._settingsData.set({ Widgets: widgetData });
    this._widgetDataLength.set(Array.from(
      { length: widgetData.length },
      (_, i) => i
    ));
  }
}
