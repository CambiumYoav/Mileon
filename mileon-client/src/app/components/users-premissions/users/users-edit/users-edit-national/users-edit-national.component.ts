import { Component, EventEmitter, Input, OnInit, Output, signal, inject, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseFormService } from '../../../../shared/base-form/base-form.service';
import {
  Field,
  FieldTypeEnum,
} from '../../../../../types/advanced-search/form-tab.model';
import { userFields } from '../../../../../types/users/user-form-fields';
import { UsersService } from '../../users.service';
import {
  UserNationalForm,
  usersValidation,
} from '../../../../../types/users/user-form';
import { SessionService } from '../../../../../services/session.service';
import { RouterService } from '../../../../../services/router.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { PermissionService } from '../../../../../services/permission.service';
import { InputTextComponent } from "../../../../shared/base/inputs/input-text/input-text.component";
import { SelectComponent } from "../../../../shared/base/select/select.component";
import { InputPhoneComponent } from "../../../../shared/base/inputs/input-phone/input-phone.component";
import { ButtonComponent } from "../../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-edit-national',
  templateUrl: './users-edit-national.component.html',
  styleUrls: ['./users-edit-national.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextComponent, 
    SelectComponent, 
    InputPhoneComponent, 
    ButtonComponent
  ],
})
export class UsersEditNationalComponent implements OnInit {
  // Inject services
  private usersService = inject(UsersService);
  private baseFormService = inject(BaseFormService);
  private sessionService = inject(SessionService);
  private toaster = inject(ToastrService);
  private routerService = inject(RouterService);
  private permissionService = inject(PermissionService);

  // Form and signals
  userForm: FormGroup;
  
  @Output() isPasswordReset = new EventEmitter<boolean>();
  @Output() isNationalUser = new EventEmitter<boolean>(true);
  disableEdit = signal<boolean>(false);
  userFields = signal(userFields);

  // Constants
  readonly FieldTypeEnum = FieldTypeEnum;

  // Private signals
  private _skipFormValidation = signal(true);

  constructor() {
    this.userForm = this.baseFormService.createFormGroup(UserNationalForm);
    this.baseFormService.setValidations(this.userForm, usersValidation);
    this.userForm.get('userName')?.disable();
    this.userForm.get('id')?.disable();
  }

  // Effect to react to permission changes
  private permissionEffect = effect(() => {
    const shouldDisable = this.disableEdit();
    if (shouldDisable) {
      // React to permission changes
      Object.entries(this.userForm.controls).forEach(
        ([controlKey, controlValue]) => {
          controlValue.disable();
        }
      );
    }
  });

  ngOnInit(): void {
    this.isNationalUser.emit(true);
    const userData = this.sessionService.get('user');
    this.fillForm(userData);
    this.checkEditPermission();
  }

  checkEditPermission() {
    const shouldDisable = !this.permissionService.checkUserPermission('update/global');
    this.disableEdit.set(shouldDisable);
  }

  fillForm(userData: any): void {
    this.userForm.patchValue({
      email: userData.email,
      userName: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      id: userData.id,
      phone: userData.phone,
      password: userData.password,
    });
  }

  async updateNationalUser() {
    this._skipFormValidation.set(false);
    this.userForm.removeControl('password');
    console.log(this.userForm);

    const enabledControlsValid = Object.keys(this.userForm.controls)
      .filter(
        (key) => this.userForm.get(key) && !this.userForm.get(key)!.disabled
      )
      .every((key) => this.userForm.get(key)?.valid);
    if (enabledControlsValid) {
      try {
        const formData = { ...this.userForm.getRawValue() };
        let currentUser: any = this.sessionService.get('user');
        formData['userID'] = currentUser.userID;
        const res = await this.usersService.updateUserNational(formData);

        if (res) {
          this.toaster.success(ErrorSuccessMessages.USER_UPDATED_SUCCESSFULY);
          this.routerService.back();
        }
      } catch (error) {
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
        console.log(error);
      }
    } else {
      console.log('Form is not valid');
      console.log(this.userForm.value); // This will NOT include disabled fields
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  isFieldValid(fieldName: string): boolean {
    return this.userForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  resetPassword(): void {
    this.isPasswordReset.emit(true);
  }
}
