import { ConfirmationModalComponent } from './../../shared/confirmation-modal/confirmation-modal.component';
import { Component, effect, inject, ViewChild, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { ModalMessages } from '../../../constants/modalMessages';
import { AuthorityService } from '../../../services/authority.service ';
import { LookupNewService } from '../../../services/lookup-new.service';
import { SessionService } from '../../../services/session.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ParkingPermitsTypesForm } from '../../../types/parkingPermit/parking-permit-from-fields';
import { DynamicFormsUtils } from '../../../utils/dynamicForms';
import { ParkingPermitsDynamicFormComponent } from '../parking-permits-dynamic-form/parking-permits-dynamic-form.component';
import { ParkingPermitsService } from '../parking-permits.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-parking-permits-types-create-update',
  imports: [
    ParkingPermitsDynamicFormComponent,
    ButtonComponent,
    ConfirmationModalComponent,
    CheckboxComponent,
  ],
  templateUrl: './parking-permits-types-create-update.component.html',
  styleUrl: './parking-permits-types-create-update.component.scss',
})
export class ParkingPermitsTypesCreateUpdateComponent {
  private authorityService = inject(AuthorityService);
  private toaster = inject(ToastrService);
  private router = inject(Router);
  private parkingPermitService = inject(ParkingPermitsService);
  private route = inject(ActivatedRoute);
  private sessionService = inject(SessionService);
  private lookupService = inject(LookupNewService);

  readonly Icons = ConstPath;
  readonly isActiveText: string =
    ModalMessages.ARE_YOU_SURE_IS_ACTIVE_PERMIT_TYPE;
  readonly isInActiveText: string =
    ModalMessages.ARE_YOU_SURE_IS_INACTIVE_PERMIT_TYPE;
  readonly updateTitle: string = ModalMessages.UPDATE_PERMIT_TYPE;

  form: any;
  
  formRecreationTrigger = signal<number>(0);
  isActive = signal<boolean>(true);
  isEditMode = signal<boolean>(false);
  typeId = signal<string | any>('');
  isActiveModalOpen = signal(false);
  allAreas = signal<any[]>([]);

  readonly authorityId = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });

  @ViewChild('form1') formComponent1!: ParkingPermitsDynamicFormComponent;

  constructor() {
    const form = new ParkingPermitsTypesForm();
    this.form = form.PermitTypeSettingsFields;

    effect(() => {
      const authorityID = this.authorityId();
      if (!authorityID) return;

      this.formRecreationTrigger.update((value) => value + 1);
      this.getAllAreas();
      if (this.isEditMode()) this.loadPermitTypeById(this.typeId());
    });
  }

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.isEditMode.set(currentUrl.includes('/edit'));

    if (this.isEditMode()) {
      const isActive = this.route.parent?.snapshot.paramMap.get('isActive');
      this.isActive.set(isActive === 'true');

      if (!this.isActive()) this.disableAllForm();
      // Get parameters from parent route (not current route)
      this.typeId.set(this.route.parent?.snapshot.paramMap.get('id'));
      this.loadPermitTypeById(this.typeId());
    }
  }

  ngAfterViewInit() {
    // Now the child exists; safe to call
    if (!this.isActive() && this.isEditMode())
      this.formComponent1.setDisabled(true);
  }

  async loadPermitTypeById(id: number) {
    try {
      const res = await this.parkingPermitService.getPermitTypeById(id);
      if (res) {
        this.patchDynamicForm(this.form, res);
        this.isActive.set(res.isActive);
        if (!this.isActive() && this.isEditMode()) {
          this.disableAllForm();
          return;
        }
        this.disableAllForm(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  checkIfFormIsValid(event: any): void {
    // Use the explicit isValid if available, otherwise check status
    const isFormValid =
      event.isValid !== undefined
        ? event.isValid
        : event.form.status === 'VALID';
    console.log(event);
    const formData = {
      form: event.form,
      isValid: isFormValid,
    };
    console.log(formData);
    this.createOrUpdatePermitType(formData.form);
  }

  submitForm() {
    this.formComponent1.onSubmit();
  }

  async createOrUpdatePermitType(body: any) {
    try {
      const res = await this.parkingPermitService.createOrUpadatePermitType(
        body
      );
      if (res) {
        let message = this.isEditMode()
          ? ErrorSuccessMessages.PERMIT_TYPE_EDITED_SUCCESSFULY
          : ErrorSuccessMessages.PERMIT_TYPE_CREATED_SUCCESSFULY;
        this.toaster.success(message);
        this.sessionService.set(
          'authorityPermitTypeID',
          res.authorityPermitTypeID
        );
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }

  private patchDynamicForm(formConfig: any[], data: any) {
    DynamicFormsUtils.patchDynamicForm(formConfig, data);
    // Trigger form recreation

    this.formRecreationTrigger.update((value) => value + 1);
  }

  async updateIsActive() {
    try {
      if (this.typeId) {
        const res = await this.parkingPermitService.updateIsActive(
          this.typeId(),
          !this.isActive()
        );
        if (res) {
          this.toaster.success(
            ErrorSuccessMessages.PERMIT_TYPE_EDITED_SUCCESSFULY
          );
          this.loadPermitTypeById(this.typeId());
          this.toggleActive(!this.isActive());
        }
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }

  toggleActive(newValue: boolean) {
    const id =
      this.route.snapshot.paramMap.get('id') ??
      this.route.parent?.snapshot.paramMap.get('id');
    const newValueStr = newValue ? 'true' : 'false';
    this.router.navigate(
      [
        '/main',
        'admin',
        'parking-permits',
        'edit',
        'create-update-main',
        id,
        newValueStr,
        'types-settings',
      ],
      { replaceUrl: true }
    );
  }

  closeIsActiveModal() {
    this.isActiveModalOpen.set(false);
  }

  openIsActiveModal() {
    this.isActiveModalOpen.set(true);
  }

  disableAllForm(disable = true) {
    this.formComponent1?.setDisabled(disable);
  }
  async getAllAreas() {
    try {
      const res = await this.lookupService.getAreas({
        authorityIDs: [this.authorityId() ?? ''],
        currentPage: 1,
        pageSize: 10,
      });
      if (res && res.list) {
        this.allAreas.set(Array.isArray(res) ? res : res.list);
      }
    } catch (e) {}
  }
}
