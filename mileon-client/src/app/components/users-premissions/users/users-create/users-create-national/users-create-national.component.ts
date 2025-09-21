import { Component, Input, OnInit, signal, computed, inject, effect } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FieldTypeEnum } from '../../../../../types/advanced-search/form-tab.model';
import { userFields } from '../../../../../types/users/user-form-fields';
import { UsersService } from '../../users.service';
import { BaseFormService } from '../../../../../components/shared/base-form/base-form.service';
import {
  UserNationalForm,
  usersValidation,
} from '../../../../../types/users/user-form';

import { ConstPath } from '../../../../../constants/const_path';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { RouterService } from '../../../../../services/router.service';
import { InputTextComponent } from "../../../../shared/base/inputs/input-text/input-text.component";
import { SelectComponent } from "../../../../shared/base/select/select.component";
import { InputPhoneComponent } from "../../../../shared/base/inputs/input-phone/input-phone.component";
import { ButtonComponent } from "../../../../shared/base/button/button.component";

@Component({
  selector: 'app-users-create-national',
  templateUrl: './users-create-national.component.html',
  styleUrls: ['./users-create-national.component.scss'],
  imports: [ReactiveFormsModule, InputTextComponent, SelectComponent, InputPhoneComponent, ButtonComponent],
})
export class UsersCreateNationalComponent implements OnInit {
  private usersService = inject(UsersService);
  private baseFormService = inject(BaseFormService);
  private toaster = inject(ToastrService);
  private routerService = inject(RouterService);

  userFields = userFields;
  FieldTypeEnum = FieldTypeEnum;
  Icons = ConstPath;

  private _skipFormValidation = signal(true);

  userForm: FormGroup;

  constructor() {
    this.userForm = this.baseFormService.createFormGroup(UserNationalForm);
    this.baseFormService.setValidations(this.userForm, usersValidation);
  }

  ngOnInit(): void {}

  isValidIsraeliID(): boolean {
    const idControl = this.userForm.controls['id'];
    let id = this.userForm.controls['id'].value;

    if (!idControl || !idControl.value) {
      return this.isFieldValid('id'); // No validation errors if the password is empty
    }

    id = id.padStart(9, '0');
    if (!/^\d{9}$/.test(id)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let num = +id[i] * (i % 2 === 0 ? 1 : 2);
      sum += num > 9 ? num - 9 : num;
    }
    return sum % 10 === 0;
  }

  //send to server
  async createNationalUser() {
    console.log(this.userForm.value);
    this._skipFormValidation.set(false);
    if (this.userForm.valid) {
      try {
        const res = await this.usersService.createUserNational(
          this.userForm.value
        );

        if (res && res.success) {
          this.toaster.success(ErrorSuccessMessages.USER_CREATED_SUCCESSFULY);
          this.routerService.back();
        }
      } catch (e) {
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
        console.log(e);
      }
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  isFieldValid(fieldName: string): boolean {
    return this.userForm.get(fieldName)?.valid || this._skipFormValidation();
  }

  isPasswordFieldIsValid() {
    const passwordControl = this.userForm.controls['password'];
    const emailControl = this.userForm.controls['email'];
    const phoneControl = this.userForm.controls['phone'];

    // Ensure password exists
    if (!passwordControl || !passwordControl.value) {
      return this.isFieldValid('password'); // No validation errors if the password is empty
    }

    const password = passwordControl.value;
    const email = emailControl?.value;
    const phone = phoneControl?.value;

    // Check if the password contains the email
    if (email && password.includes(email)) {
      return false;
    }

    // Check if the password contains the phone
    if (phone && password.includes(phone)) {
      return false;
    }

    return this.isFieldValid('password'); // Password is valid
  }
}
