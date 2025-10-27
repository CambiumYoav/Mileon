import { Component, Output, EventEmitter, signal, inject, ChangeDetectionStrategy, OnChanges, SimpleChanges, input } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
  AbstractControl,
  ValidationErrors,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { ConstPath } from '../../../constants/const_path';
import { CommonModule } from '@angular/common';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';

@Component({
  selector: 'app-authority-management-dymanic-form',
  templateUrl: './authority-management-dymanic-form.component.html',
  styleUrls: ['./authority-management-dymanic-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputDateComponent,
    InputTextComponent,
  ],
})
export class AuthorityManagementDymanicFormComponent implements OnChanges {
  readonly title = input<string>('');
  readonly rows = input<DynamicRow[]>([]);
  readonly triggerFormRecreation = input<number>(0);

  private readonly _isSubmitted = signal<boolean>(false);

  get isSubmitted(): boolean {
    return this._isSubmitted();
  }

  readonly Icons = ConstPath;
  readonly optionsApps: CheckboxOption[] = [
    { value: true, label: 'פעיל', checked: true },
  ];

  dynamicForm!: FormGroup;
  dataSubject = new Subject<any>();

  private readonly fb = inject(FormBuilder);
  private readonly toaster = inject(ToastrService);

  @Output() formSubmitted = new EventEmitter<any>();

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSubmitted'] && changes['isSubmitted'].currentValue === true) {
      this.onSubmit();
    }
    if (changes['rows'] || changes['triggerFormRecreation']) {
      if (this.rows() && this.rows().length > 0) {
        this.createForm();
      }
    }
  }
  /** Creates the reactive form dynamically based on rows and fields */
  public createForm(): void {
    const formGroup = this.rows().reduce((group, dynamicRow) => {
      dynamicRow.row.forEach((field) => {
        group[field.name] = this.createFieldControl(field);
      });
      return group;
    }, {} as { [key: string]: any });

    this.dynamicForm = this.fb.group(formGroup);
    
    // Disable fields that should be disabled
    this.rows().forEach(dynamicRow => {
      dynamicRow.row.forEach((field) => {
        if (field.disabled) {
          const control = this.dynamicForm.get(field.name);
          if (control) {
            control.disable();
          }
        }
      });
    });
    
    this.addCustomValidators();
  }

  private createFieldControl(field: any): any {
    const validations = this.getFieldValidations(field);
    const initialValue = field.value ?? '';
    
    return [initialValue, validations];
  }
  private addCustomValidators(): void {
    const startDateControl = this.dynamicForm.get('contractStartDate');
    const endDateControl = this.dynamicForm.get('contractEndDate');
    const guaranteeValidityControl = this.dynamicForm.get(
      'guaranteeValidityDate'
    );

    if (startDateControl && endDateControl) {
      // Add validator to end date that checks against start date
      endDateControl.setValidators([
        ...this.getFieldValidators(this.getFieldConfig('contractEndDate')),
        this.dateRangeValidator('contractStartDate'),
      ]);

      // Listen to start date changes to revalidate end date
      startDateControl.valueChanges.subscribe(() => {
        endDateControl.updateValueAndValidity();
      });
    }

    // Add separate validation for guarantee validity date if needed
    if (startDateControl && guaranteeValidityControl) {
      guaranteeValidityControl.setValidators([
        ...this.getFieldValidators(
          this.getFieldConfig('guaranteeValidityDate')
        ),
        this.dateRangeValidator('contractStartDate'),
      ]);

      startDateControl.valueChanges.subscribe(() => {
        guaranteeValidityControl.updateValueAndValidity();
      });
    }
  }

  private getFieldValidators(field: any): ValidatorFn[] {
    if (!field) return [];
    return this.getFieldValidations(field);
  }
  // Custom validator function
  private dateRangeValidator(startDateFieldName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate if no value (let required validator handle it)
      }

      const startDateControl = this.dynamicForm?.get(startDateFieldName);
      if (!startDateControl || !startDateControl.value) {
        return null; // No start date to compare against
      }

      const startDate = new Date(startDateControl.value);
      const endDate = new Date(control.value);

      if (endDate <= startDate) {
        return {
          dateRange: {
            actualValue: control.value,
            requiredMinDate: startDateControl.value,
          },
        };
      }

      return null;
    };
  }

  // Helper method to get field configuration
  private getFieldConfig(fieldName: string): any {
    for (const rowGroup of this.rows()) {
      const field = rowGroup.row.find((f) => f.name === fieldName);
      if (field) return field;
    }
    return null;
  }

  /** Retrieves validations for a specific field */
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

  isFieldValid(name: string): boolean {
    const control = this.dynamicForm.get(name);

    if (!control || control.disabled) return true;
    return control.touched ? control.valid : true;
  }
  convertToUTCDateOnly(date: Date): string {
    return date.toISOString().split('T')[0];
  }
  /** Handles form submission */
  onSubmit(): void {
    const dateKeys = [
      'contractStartDate',
      'contractEndDate',
      'guaranteeValidityDate',
    ];

    dateKeys.forEach((key) => {
      const control = this.dynamicForm.get(key);
      if (control?.value) {
        const originalDate = new Date(control.value);
        originalDate.setDate(originalDate.getDate() + 1);
        const convertedUTC = this.convertToUTCDateOnly(originalDate);
        control.setValue(convertedUTC);
      }
    });

    const emissionData = {
      form: this.dynamicForm,
      isValid: this.dynamicForm.valid,
      status: this.dynamicForm.status,
      formTitle: this.title(), // Add this for debugging
    };
    this._isSubmitted.set(true);
    console.log('Form submitted:', this.dynamicForm);

    this.formSubmitted.emit(emissionData);

    if (!this.dynamicForm.valid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      this.markAllFieldsAsTouched();
    } else {
      console.log('Form is valid, no toast needed');
    }
  }

  /** Mark all form fields as touched to trigger validation display */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.dynamicForm.controls).forEach((key) => {
      const control = this.dynamicForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  public resetForm(): void {
    if (!this.dynamicForm) return;

    this.dynamicForm.reset(); // Resets all form values to `null` or ''
    this._isSubmitted.set(false);
  }
}
