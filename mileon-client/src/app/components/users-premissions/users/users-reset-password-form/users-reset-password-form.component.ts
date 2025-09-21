import { Component, Inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ConstPath } from '../../../../constants/const_path';
import { ModalButton } from '../../../../constants/modalButtons';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { InputTextComponent } from "../../../shared/base/inputs/input-text/input-text.component";

@Component({
  selector: 'app-users-reset-password-form',
  templateUrl: './users-reset-password-form.component.html',
  styleUrls: ['./users-reset-password-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    InputTextComponent
  ],
})
export class UsersResetPasswordFormComponent implements OnInit {
  readonly Icons = ConstPath;
  title = signal<string>('');
  fields = signal<DynamicField[]>([]);
  dynamicForm!: FormGroup;
  isSubmitted = signal<boolean>(false);
  dataSubject = new Subject<any>();
  isModalOpen = signal<boolean>(false);
  modalButtons = signal<ModalButton[]>(this.createModalButtons());
  isForgotPassword = signal<boolean>(false);
  private _skipFormValidation = signal<boolean>(true);
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UsersResetPasswordFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicField[];
      title: string;
      isEdit: boolean;
      forgotPassword: boolean;
    },
    private toaster: ToastrService
  ) {
    this.fields.set(data.form);
    this.title.set(data.title);
  }

  ngOnInit(): void {
    this.createForm();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private createForm(): void {
    const formGroup = (this.fields() || []).reduce((group, field) => {
      group[field.name] = this.createFieldControl(field);
      return group;
    }, {} as { [key: string]: any });

    this.dynamicForm = this.fb.group(formGroup, {
      validators: this.matchPasswordsValidator('password', 'confirmPassword'),
    });
  }

  private createFieldControl(field: DynamicField): any {
    const validations = this.getFieldValidations(field);
    return [field.value ?? '', validations];
  }

  private getFieldValidations(field: DynamicField): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const { validations: fieldValidations } = field;

    if (fieldValidations) {
      if (fieldValidations.required) validations.push(Validators.required);
      if (fieldValidations.maxLength)
        validations.push(Validators.maxLength(fieldValidations.maxLength));
      if (fieldValidations.minLength)
        validations.push(Validators.minLength(fieldValidations.minLength));
      if (fieldValidations.pattern)
        validations.push(Validators.pattern(fieldValidations.pattern));
      if (fieldValidations.min !== undefined)
        validations.push(Validators.min(fieldValidations.min));
      if (fieldValidations.max !== undefined)
        validations.push(Validators.max(fieldValidations.max));
    }

    return validations;
  }

  matchPasswordsValidator(
    controlName: string,
    matchingControlName: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null; // Controls not found
      }

      return control.value === matchingControl.value
        ? null
        : { passwordsMismatch: true };
    };
  }

  /** Handles form submission */
  onSubmit(): void {
    this._skipFormValidation.set(false);
    if (this.dynamicForm.valid) {
      this.dataSubject.next({
        form: this.dynamicForm.value,
        isResetPassword: true,
      }); // Emit form data if valid
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this.isSubmitted.set(true); // Mark form as submitted to show validation errors
    }
  }

  onLinkClick() {
    this.isModalOpen.set(true);
    this.dataSubject.next({
      isForgotPassword: true,
    });
  }

  closeModal() {
    this.isModalOpen.set(false);
  }

  createModalButtons(): ModalButton[] {
    return [{ label: 'סגור', action: () => this.closeModal() }];
  }
}
