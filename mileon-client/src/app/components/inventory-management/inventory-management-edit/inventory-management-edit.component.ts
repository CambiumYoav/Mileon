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
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { InventoryManagementService } from '../inventory-management.service';
import { DeviceLog } from '../../../types/inventory-management/inventoryTypes';
import { InventoryActionType } from '../../../types/enum/InventoryManagementEnum';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputCheckboxOptionGroupComponent } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { InputPhoneComponent } from '../../shared/base/inputs/input-phone/input-phone.component';
import { TruncatedTextTooltipDirective } from '../../../directives/truncated-text-tooltip.directive';

@Component({
  selector: 'app-inventory-management-edit',
  templateUrl: './inventory-management-edit.component.html',
  styleUrls: ['./inventory-management-edit.component.scss'],
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
    TruncatedTextTooltipDirective,
  ],
})
export class InventoryManagementEditComponent {
  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(
    MatDialogRef<InventoryManagementEditComponent>
  );
  public readonly data = inject<{
    form: DynamicRow[];
    title: string;
    isEdit: boolean;
    deviceId: string;
    divisionIds: string; //TODO -  need to be array
  }>(MAT_DIALOG_DATA);
  private readonly toaster = inject(ToastrService);
  private readonly inventoryService = inject(InventoryManagementService);

  readonly Icons = ConstPath;
  readonly title = this.data?.title || '';
  readonly rows = this.data?.form || [];
  readonly deviceId = this.data?.deviceId || '';

  readonly isSubmitted = signal(false);
  readonly dynamicForm: WritableSignal<FormGroup>;
  readonly deviceLogHistory = signal<DeviceLog[]>([]);
  readonly dataSubject = new Subject<any>();

  readonly inventoryActionType = InventoryActionType;

  readonly optionsDevisions: CheckboxOption[] = [
    { value: 2, label: 'חניה' },
    { value: 3, label: 'כללי' },
    { value: 1, label: 'מנהלי' },
  ];

  constructor() {
    this.dynamicForm = signal(this.createForm());

    this.setupAuthorityChangeEffect();
    this.loadDeviceLogs();

    if (this.data.divisionIds) {
      this.updateFormField();
    }
  }

  /** Closes the dialog */
  onNoClick(): void {
    this.dialogRef.close();
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
        } else {
          control?.disable();
          control?.reset();
        }
        control?.updateValueAndValidity();
      });
    });

    // If authorityId is already set, enable the fields
    if (authorityControl.value) {
      dependentControls.forEach((field) => {
        this.dynamicForm().get(field)?.enable();
      });
    }
  }

  private updateFormField(): void {
    if (this.optionsDevisions && Array.isArray(this.data.divisionIds)) {
      this.optionsDevisions.forEach((option) => {
        option.checked = this.data.divisionIds.includes(option.value);
      });
      const selectedValues = this.optionsDevisions
        .filter((option) => option.checked)
        .map((option) => option.value);

      this.dynamicForm().patchValue({ divisionIds: selectedValues });
    }
  }

  /** Creates the reactive form */
  private createForm(): FormGroup {
    const formGroup = this.rows.reduce((group, dynamicRow) => {
      dynamicRow.row.forEach((field) => {
        if (field.name === 'typeId') {
          field.disabled = true;
        }
        group[field.name] = this.createFieldControl(field);
      });
      return group;
    }, {} as { [key: string]: any });

    return this.fb.group(formGroup);
  }

  private createFieldControl(field: any): any {
    const validations = this.getFieldValidations(field);
    return field.type === 'fromTo' && field.fields?.length > 0
      ? this.createFromToGroup(field, validations)
      : [field.value ?? '', validations];
  }

  private createFromToGroup(field: any, validations: ValidatorFn[]): any {
    return this.fb.group({
      from: [field.fields[0]?.value || '', validations],
      to: [field.fields[1]?.value || '', validations],
    });
  }

  onSelectionChange(selectedValues: any, fieldName: string): void {
    this.dynamicForm().patchValue({ [fieldName]: selectedValues });
  }

  isFieldValid(name: string): boolean {
    const control = this.dynamicForm().get(name);
    return !control || control.disabled || control.valid || !this.isSubmitted();
  }

  private getFieldValidations(field: any): ValidatorFn[] {
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

  private async loadDeviceLogs(): Promise<void> {
    if (this.deviceId) {
      const logs = await this.inventoryService.getDeviceLogs(this.deviceId);
      this.deviceLogHistory.set(logs);
    }
  }

  /** Handles form submission */
  onSubmit(): void {
    this.isSubmitted.set(true);
    const form = this.dynamicForm();

    if (form.invalid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', form);
      return;
    }

    this.dataSubject.next({
      form: form.getRawValue(),
      isEdit: this.data.isEdit,
    });
  }

  formatValue(value: string): string {
    if (!value) return '';
    const match = value.match(/\[([^\]]+)\]/);
    return match ? `[${match[1]}]` : value;
  }
}
