import {
  Component,
  inject,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputCheckboxOptionGroupComponent } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { InputPhoneComponent } from '../../shared/base/inputs/input-phone/input-phone.component';
import { InputNumberComponent } from '../../shared/base/inputs/input-number/input-number.component';

@Component({
  selector: 'app-inventory-management-add',
  templateUrl: './inventory-management-add.component.html',
  styleUrls: ['./inventory-management-add.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    SelectComponent,
    ButtonComponent,
    InputDateComponent,
    InputCheckboxOptionGroupComponent,
    InputTextComponent,
    InputPhoneComponent,
    InputNumberComponent
  ],
})
export class InventoryManagementAddComponent {
  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(
    MatDialogRef<InventoryManagementAddComponent>
  );
  public readonly data = inject<{
    form: DynamicRow[];
    title: string;
    isEdit: boolean;
  }>(MAT_DIALOG_DATA);
  private readonly toaster = inject(ToastrService);

  readonly Icons = ConstPath;
  readonly title = this.data?.title || 'Default Title';
  readonly rows = this.data?.form || [];

  readonly isSubmitted = signal(false);
  readonly dynamicForm: WritableSignal<FormGroup>;
  public readonly dataSubject = new Subject<any>();

  readonly optionsDevisions: CheckboxOption[] = [
    { value: 2, label: 'חניה', checked: false },
    { value: 3, label: 'כללי', checked: false },
    { value: 1, label: 'מנהלי', checked: false },
  ];

  constructor() {
    // Initialize form
    this.dynamicForm = signal(this.createForm());

    // Setup authority change effect
    this.setupAuthorityChangeEffect();
  }

  /** Closes the dialog */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Creates the reactive form dynamically based on rows and fields */
  private createForm(): FormGroup {
    const formGroup: { [key: string]: FormControl | FormGroup } = {};

    this.rows.forEach((dynamicRow) => {
      dynamicRow.row.forEach((field) => {
        formGroup[field.name] = this.createFieldControl(field);
      });
    });

    return this.fb.group(formGroup);
  }

  /** Setup effect to handle authority changes using signals */
  private setupAuthorityChangeEffect(): void {
    const authorityControl = this.dynamicForm().get('authorityId');

    if (!authorityControl) return;

    const dependentControls = [
      'inspectorId',
      'roleId',
      'divisionIds',
      'inspectorPhone',
      'dateDelivery',
    ];

    // Disable all dependent controls by default
    dependentControls.forEach((field) =>
      this.dynamicForm().get(field)?.disable()
    );

    // Convert authority control valueChanges to signal
    const authorityValue = toSignal(authorityControl.valueChanges, {
      initialValue: authorityControl.value,
    });

    // Use effect to reactively handle changes
    effect(() => {
      const value = authorityValue();
      const form = this.dynamicForm();

      dependentControls.forEach((field) => {
        const control = form.get(field);
        if (value) {
          control?.enable();
          control?.updateValueAndValidity();
        } else {
          control?.disable();
          control?.reset();
        }
      });
    });
  }

  private createFieldControl(field: any): FormControl | FormGroup {
    const validations = this.getFieldValidations(field);

    return this.isFromToField(field)
      ? this.createFromToGroup(field, validations)
      : this.fb.control(field.value ?? '', validations);
  }

  private isFromToField(field: any): boolean {
    return field.type === 'fromTo' && field.fields?.length > 0;
  }

  private createFromToGroup(field: any, validations: ValidatorFn[]): FormGroup {
    return this.fb.group({
      from: [field.fields?.[0]?.value || '', validations],
      to: [field.fields?.[1]?.value || '', validations],
    });
  }
  onSelectionChange(selectedValues: any, fieldName: string): void {
    this.dynamicForm().patchValue({ [fieldName]: selectedValues.join(',') });
  }

  isFieldValid(name: string): boolean {
    const control = this.dynamicForm().get(name);

    // If control doesn't exist or is disabled, consider it valid
    if (!control || control.disabled) {
      return true;
    }

    return control.valid || !this.isSubmitted();
  }

  /** Retrieves validations for a specific field */
  private getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];

    if (!field.validations) return validations;

    const { required, maxLength, minLength, pattern, min, max } =
      field.validations;

    if (required) validations.push(Validators.required);
    if (maxLength) validations.push(Validators.maxLength(maxLength));
    if (minLength) validations.push(Validators.minLength(minLength));
    if (pattern) validations.push(Validators.pattern(pattern));
    if (min !== undefined) validations.push(Validators.min(min));
    if (max !== undefined) validations.push(Validators.max(max));

    return validations;
  }

  /** Handles form submission */
  onSubmit(): void {
    this.isSubmitted.set(true);
    const form = this.dynamicForm();
    console.log(form.value);
    if (form.valid) {
      this.dataSubject.next({
        form: form.value,
        isEdit: this.data.isEdit,
      });
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', form);
    }
  }
}
