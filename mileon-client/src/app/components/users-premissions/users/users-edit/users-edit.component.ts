import { ToastrService } from 'ngx-toastr';
import { RouterService } from '../../../../services/router.service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../../constants/const_path';
import { FieldTypeEnum } from '../../../../types/advanced-search/form-tab.model';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { userFields } from '../../../../types/users/user-form-fields';
import { SessionService } from './../../../../services/session.service';
import { Component, OnInit, signal, computed, effect, Injector, runInInjectionContext } from '@angular/core';
import { BaseFormService } from '../../../../components/shared/base-form/base-form.service';
import { AuthorityService } from '../../../../services/authority.service ';
import { UserForm, usersValidation } from '../../../../types/users/user-form';
import { ModalButton } from '../../../../constants/modalButtons';
import { MatDialog } from '@angular/material/dialog';
import { UsersForms } from '../../../../types/users/users-table.model';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { UsersResetPasswordFormComponent } from '../users-reset-password-form/users-reset-password-form.component';
import { ModalMessages } from '../../../../constants/modalMessages';
import { AuthService } from '../../../../services/auth.service';
import { UsersService } from '../users.service';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { PermissionService } from '../../../../services/permission.service';
import { CheckboxComponent } from "../../../shared/base/checkbox/checkbox.component";
import { AppModalComponent } from "../../../shared/app-modal/app-modal.component";
import { UsersEditLocalComponent } from "./users-edit-local/users-edit-local.component";
import { UsersEditNationalComponent } from "./users-edit-national/users-edit-national.component";
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CheckboxComponent,
    AppModalComponent,
    UsersEditLocalComponent,
    UsersEditNationalComponent,
    ButtonComponent
],
})
export class UsersEditComponent implements OnInit {
  title = signal<string>(TitlesEnum.EditUsersTitle);
  userForm: FormGroup;
  userFields = signal(userFields);
  FieldTypeEnum = FieldTypeEnum;
  Icons = ConstPath;
  dialogData = signal<DynamicField[]>([]);
  isDisableUser = signal<boolean>(false);
  isDisableModalOpen = signal<boolean>(false);
  isUndisableModalOpen = signal<boolean>(false);
  modalDisableButtons = signal<ModalButton[]>(this.createModalDisableButtons());
  modalEnableButtons = signal<ModalButton[]>(this.createModalEnableButtons());
  modalTitle = signal<string>(ModalMessages.DISABLE_USER);
  modalUndisabledTitle = signal<string>(ModalMessages.UNDISABLE_USER);
  userData = signal<any>(null);
  isNationalUser = signal<boolean>(false);
  isActive = signal<boolean>(false);
  
  currentAuthority!: any;
  isMviewAuthority!: any;
  disableEdit!: any;
  constructor(
    private sessionService: SessionService,
    private baseFormService: BaseFormService,
    private authorityService: AuthorityService,
    private routerService: RouterService,
    private dialog: MatDialog,
    private authService: AuthService,
    private usersService: UsersService,
    private toaster: ToastrService,
    private permissionService: PermissionService,
    private injector: Injector
  ) {
    this.userForm = this.baseFormService.createFormGroup(UserForm);
    this.baseFormService.setValidations(this.userForm, usersValidation);
    this.userForm.get('userName')?.disable();
    this.userForm.get('nid')?.disable();
    
    this.currentAuthority = toSignal(this.authorityService.authorityId$, { initialValue: '' });
    
    this.isMviewAuthority = computed(() => 
      this.currentAuthority() === '11111111-1111-1111-1111-111111111111'
    );
    
    this.disableEdit = computed(() => 
      this.isMviewAuthority()
        ? false
        : !this.permissionService.checkUserPermission('User/update/local') ||
          this.userForm?.get('email')?.value === this.permissionService.email
    );
  }

  ngOnInit(): void {
    const userData = this.sessionService.get('user') as any;
    this.userData.set(userData);
    this.isActive.set(userData?.isActive ?? false);
    
    this.fillForm(userData);
    const form = new UsersForms();
    this.dialogData.set(form.UsersResetPasswordForm);
  }

  async openDialogForm() {
    let dialogComponent = UsersResetPasswordFormComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',

        data: {
          form: this.dialogData(),
          title: 'איפוס סיסמה',
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      
      // Use runInInjectionContext to properly convert the Subject to a signal
      runInInjectionContext(this.injector, () => {
        const dialogResult = toSignal(dialogInstance.dataSubject);
        
        // Use effect to handle the dialog result reactively
        effect(async () => {
          const result = dialogResult();
          if (result?.isResetPassword) {
            // Handle Reset Password
            try {
              const userId = this.userData().userID;

              result.form = { ...result.form, userId: userId };

              const res = await this.authService.updatePassword(result.form);
              if (res) {
                this.toaster.success(
                  ErrorSuccessMessages.PASSWORD_RESET_SUCCESSFULY
                );

                dialogRef.close();
              }
            } catch (e) {
              this.toaster.error(
                ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
              );
              console.error(e);
            }
          }
        });
      });
    }
  }
  createModalDisableButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeModal(),  
        buttonClass: 'outline-secondary-btn',
      },
      {
        label: 'הפוך ללא פעיל',
        action: () => this.updateUserToNotActive(),
      },
    ];
  }
  createModalEnableButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeModal(),
        buttonClass: 'outline-secondary-btn',
      },
      {
        label: 'הפוך לפעיל',
        action: () => this.updateUserToNotActive(),
      },
    ];
  }

  closeModal() {
    this.isDisableModalOpen.set(false);
  }

  fillForm(userData: any): void {
    // Handle multi-select fields properly
    const groupAccessValue = userData.groupAccess;
    let processedGroupAccess = [];
    
    if (groupAccessValue) {
      if (Array.isArray(groupAccessValue)) {
        processedGroupAccess = groupAccessValue;
      } else if (typeof groupAccessValue === 'string') {
        // If it's a comma-separated string, split it
        processedGroupAccess = groupAccessValue.split(',').map(item => item.trim()).filter(item => item);
      } else {
        // If it's a single value, wrap it in an array
        processedGroupAccess = [groupAccessValue];
      }
    }

    this.userForm.patchValue({
      email: userData.email,
      userName: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: userData.id,
      phone: userData.phone,
      password: userData.password,
      automationGeneralCode: userData.automationGeneralCode,
      automationParkingCode: userData.automationParkingCode,
      groupAccess: processedGroupAccess,
      dataAccess: userData.dataAccess,
      appAccess: userData.appAccess,
      isActive: userData.isActive,
    });
  }

  goBackToUsers() {
    this.routerService.back();
  }

  onCheckboxValueChange(value: boolean): void {
    this.isDisableUser.set(value);

    if (value) {
      this.isDisableModalOpen.set(true);
    }
  }

  onCheckboxValueToActiveChange(value: boolean): void {
    this.isDisableUser.set(value);

    if (value) {
      this.isUndisableModalOpen.set(true);
      this.isDisableUser.set(false);
    }
  }

  openEdit(rowData: any): void {
    const updatedDialogData = this.dialogData().map((field) => {
      if (rowData[field.name] !== undefined) {
        return { ...field, value: rowData[field.name] }; // Update field value from rowData
      }
      return field;
    });
    this.dialogData.set(updatedDialogData);
    this.openDialogForm();
  }

  updateIsNationalUser(event: any) {
    this.isNationalUser.set(event);
  }

  async updateUserToNotActive(): Promise<void> {
    try {
      const userDataCopy = { ...this.userData() };

      // Remove the password field
      delete userDataCopy.password;

      // Update the isActive status
      userDataCopy.isActive = !this.isDisableUser();

      const updateMethod = this.isNationalUser()
        ? this.usersService.updateUserNational.bind(this.usersService)
        : this.usersService.updateUserLocal.bind(this.usersService);

      const res = await updateMethod(userDataCopy);
      if (res) {
        this.toaster.success(ErrorSuccessMessages.USER_UPDATED_SUCCESSFULY);
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Error updating user:', e);
    }
  }
}
