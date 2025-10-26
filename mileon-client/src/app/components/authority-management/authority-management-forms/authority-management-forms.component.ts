import { ToastrService } from 'ngx-toastr';
import { Component, OnInit, ViewChild, signal, computed, effect, inject, ChangeDetectionStrategy } from '@angular/core';
import { Menu } from '../../../types/base/menu.model';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthorityManagementService } from '../authority-management.service';
import { AuthorityService } from '../../../services/authority.service ';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  DEFAULT_FIELDS,
  DEFAULT_FORMS,
} from '../../../types/management/authority-form.fields';
import { SessionService } from '../../../services/session.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { RouterService } from '../../../services/router.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { Router } from '@angular/router';
import { PortalFormsUtils } from '../../../utils/portalForms';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { AuthorityManagementFormsTableComponent } from '../authority-management-forms-table/authority-management-forms-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-authority-management-forms',
  templateUrl: './authority-management-forms.component.html',
  styleUrls: ['./authority-management-forms.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatListModule,
    AuthorityManagementFormsTableComponent,
    ButtonComponent,
    ConfirmationModalComponent,
  ],
})
export class AuthorityManagementFormsComponent implements OnInit {
  private readonly _menu = signal<Menu | null>(null);
  private readonly _isExpanded = signal<boolean>(false);
  private readonly _showSubmenu = signal<boolean>(false);
  private readonly _showSubSubMenu = signal<boolean>(false);
  private readonly _currentAuthority = signal<string | null>(null);
  private readonly _data = signal<any[]>([]);
  private readonly _updatedData = signal<any[]>([]);
  private readonly _isItemSelected = signal<boolean>(false);
  private readonly _isModalOpen = signal<boolean>(false);
  private readonly _currentFormId = signal<string | null>(null);

  readonly menu = computed(() => this._menu());
  readonly isExpanded = computed(() => this._isExpanded());
  readonly showSubmenu = computed(() => this._showSubmenu());
  readonly showSubSubMenu = computed(() => this._showSubSubMenu());
  readonly currentAuthority = computed(() => this._currentAuthority());
  readonly data = computed(() => this._data());
  readonly updatedData = computed(() => this._updatedData());
  readonly isItemSelected = computed(() => this._isItemSelected());
  readonly isModalOpen = computed(() => this._isModalOpen());
  readonly currentFormId = computed(() => this._currentFormId());

  readonly Icons = ConstPath;
  readonly title = TitlesEnum.AuthorityFormsTitle;

  readonly formStates: Map<string, any[]> = new Map(); // key = formId, value = data[]
  readonly updatedDataMap: Map<string, any[]> = new Map();

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly authorityService = inject(AuthorityService);
  private readonly authorityManagementService = inject(AuthorityManagementService);
  private readonly toaster = inject(ToastrService);
  private readonly sessionService = inject(SessionService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly routerService = inject(RouterService);
  private readonly modeDetectionService = inject(ModeDetectionService);
  private readonly router = inject(Router);

  // Move effects to field initializers to ensure they run in injection context
  private readonly createdAuthorityEffect = effect(() => {
    const createdId = this.sharedDataService.getCurrentCreatedAuthority();
    if (createdId) {
      this._currentAuthority.set(createdId);
      this.getFormsByAuthority();
    }
  });

  private readonly editModeEffect = effect(() => {
    if (this.isEditMode) {
      const authorityID = this.authorityService.authorityId();
      if (authorityID) {
        this._currentAuthority.set(authorityID);
        this.getFormsByAuthority();
      }
    }
  });

  ngOnInit(): void {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementFormsComponent'
    );
  }

  get isEditMode(): boolean {
    return this.modeDetectionService.getCurrentMode();
  }

  toggle() {
    this._isExpanded.set(!this.isExpanded());
  }

  async openForm(id: string) {
    this._isItemSelected.set(true);
    this._currentFormId.set(id);
    const savedData = this.formStates.get(id);
    if (savedData) {
      this._data.set(savedData);
      return;
    }

    try {
      this._data.set(DEFAULT_FIELDS);

      const res = await this.authorityManagementService.getFormFieldsByForm(id) as any[];

      if (res.length === 0 && this.isEditMode) {
        const newFields = DEFAULT_FIELDS.filter(
          (field: any) => field.type !== 'title'
        );
        // Create fields with defaults
        const created =
          await this.authorityManagementService.createAuthorityFormsAndFields(
            this.currentAuthority()!,
            newFields
          );

        if (created) {
          // Fetch the updated data from server after creation
          const updatedRes =
            await this.authorityManagementService.getFormFieldsByForm(id) as any[];

          if (updatedRes.length > 0) {
            const mapped = PortalFormsUtils.mapCreatedFieldsToDefaults(
              updatedRes,
              DEFAULT_FIELDS
            );
            this._data.set(mapped);
          } else {
            // Fallback: map the created fields directly
            const mapped = PortalFormsUtils.mapCreatedFieldsToDefaults(
              created as any[],
              DEFAULT_FIELDS
            );
            this._data.set(mapped);
          }
        }
      } else if (!this.isEditMode) {
        // Detect new fields that aren't on the server
        const existingNames = res.map((f: any) => f.name?.trim());
        const newFields = DEFAULT_FIELDS.filter(
          (field: any) =>
            field.type !== 'title' &&
            !existingNames.includes(field.name?.trim())
        );

        if (newFields.length > 0) {
          const created =
            await this.authorityManagementService.createAuthorityFormsAndFields(
              this.currentAuthority()!,
              newFields
            );

          // Fetch updated data after creating new fields
          const updatedRes =
            await this.authorityManagementService.getFormFieldsByForm(id) as any[];

          if ((created as any)?.length && updatedRes.length > 0) {
            this._data.set(PortalFormsUtils.mapCreatedFieldsToDefaults(
              updatedRes,
              DEFAULT_FIELDS
            ));
            return;
          }
        }

        this._data.set(res.length > 0 ? res : DEFAULT_FIELDS);
        // this.data = PortalFormsUtils.mergeWithTitles(DEFAULT_FIELDS, res);
      }
      this._data.set(res);
      this._data.set(PortalFormsUtils.mergeWithTitles(DEFAULT_FIELDS, res));
    } catch (e) {
      console.log('Error in openForm:', e);
    }
  }

  async getFormsByAuthority() {
    try {
      // Show default menu immediately
      this._menu.set(PortalFormsUtils.buildMenuFromServer(DEFAULT_FORMS));

      const res = await this.authorityManagementService.getFormsByAuthority(
        this.currentAuthority()!
      ) as any;

      if (JSON.stringify(res) !== '{}') {
        // Replace menu silently with server version
        // this.menu = this.buildMenuFromServer(res);
        const mergedForms = PortalFormsUtils.mergeFormsWithIDs(
          DEFAULT_FORMS,
          res
        );
        this._menu.set(PortalFormsUtils.buildMenuFromServer(mergedForms));
      } else {
        const payload = Object.entries(DEFAULT_FORMS).map(
          ([ticketTypeID, forms]) => ({
            ticketTypeID: +ticketTypeID,
            forms: forms.map((form: any) => ({
              formName: form.formName,
              formKey: form.formKey ?? null,
            })),
          })
        );
        const created =
          await this.authorityManagementService.createFormForAuthority(
            this.currentAuthority()!,
            payload
          ) as any;

        if (created) {
          const mergedForms = PortalFormsUtils.mergeFormsWithIDs(
            DEFAULT_FORMS,
            created
          );
          this._menu.set(PortalFormsUtils.buildMenuFromServer(mergedForms));
        }
      }
    } catch (e) {
      console.error('getFormsByAuthority failed:', e);
      // Fallback already handled by default shown earlier
    }
  }

  getUpdatedFormValues(data: Map<string, any>) {
    const payload = Array.from(data.values());
    // Send `payload` to server
    this._updatedData.set(payload);
    if (this.currentFormId()) {
      this.formStates.set(this.currentFormId()!, payload);
      this.updatedDataMap.set(this.currentFormId()!, payload);
    }
  }

  saveFormValuesInSession() {
    this.sessionService.set('authorityForms', this.updatedData());
  }

  async updateForm() {
    try {
      const payload = Array.from(this.updatedDataMap.values()).flat();

      const res = await this.authorityManagementService.updateAuthorityForm(
        payload
      );
      if (res) {
        this.toaster.success(ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async saveAuthorityForms() {
    //save to session
    try {
      const payload = Array.from(this.updatedDataMap.values()).flat();
      const res = await this.authorityManagementService.updateAuthorityForm(
        payload
      );

      if (res && this.isEditMode) {
        this.toaster.success(ErrorSuccessMessages.SETTINGS_UPDATED_SUCCESSFULY);
        await this.updateIsCreated();

        this.goToHomePage();
      }
      if (res && !this.isEditMode) {
        await this.updateIsCreated();
        this.toaster.success(
          ErrorSuccessMessages.AUTHORITY_CREATED_SUCCESSFULY
        );
        this.goToHomePage();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async updateIsCreated() {
    try {
      if (this.currentAuthority()) {
        const res = await this.authorityManagementService.updateIsCreated(
          this.currentAuthority()!,
          true
        );
      }
    } catch (e) {
      console.log('e', e);
    }
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  back() {
    this.routerService.back();
  }

  openModal() {
    this._isModalOpen.set(true);
  }

  closeModal() {
    this._isModalOpen.set(false);
  }
}
