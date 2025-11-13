import {
  Component,
  Inject,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectorRef,
  OnInit,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  DynamicRow,
  FieldOption,
} from '../../../types/infrastructure/InfrastructureTypes';
import { BaseComponents, SharedImports } from '../../../shared/shared-modules';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import {
  RadioButtonComponent,
  RadioOption,
} from '../../shared/base/radio-button/radio-button.component';

@Component({
  selector: 'app-infrastructures-form-wrapper',
  templateUrl: './infrastructures-form-wrapper.component.html',
  styleUrls: ['./infrastructures-form-wrapper.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ...SharedImports,
    ...BaseComponents,
    RadioButtonComponent,
  ],
})
export class InfrastructuresFormWrapperComponent implements OnInit {
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<InfrastructureFormComponent>);
  public data = inject(MAT_DIALOG_DATA) as {
    mainTitle: string;
    isEdit: boolean;
    sections: { title: string; rows: DynamicRow[] }[];
  };
  private toaster = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  readonly Icons = ConstPath;
  readonly FieldTypeEnum = FieldTypeEnum;
  mainTitle = signal<string>(this.data.mainTitle);
  formSections = signal<{ title: string; rows: DynamicRow[] }[]>(
    this.data.sections
  );
  sectionsFormGroup = signal<FormGroup>(this.fb.group({}));
  isSubmitted = signal<boolean>(false);
  private _skipFormValidation = signal<boolean>(false);

  formData = signal<any>(null);

  constructor() {
    // Don't call initializeForm() in constructor to avoid change detection issues
  }

  ngOnInit(): void {
    this.initializeForm();
    console.log(this.formSections());
  }

  // private formValidationEffect = effect(() => {
  //   const isSubmitted = this.isSubmitted();
  //   const formGroup = this.sectionsFormGroup();

  //   // React to form submission state changes
  //   if (isSubmitted && formGroup) {
  //     // Could add additional validation logic here if needed
  //     this.cdr.detectChanges();
  //   }
  // });

  private initializeForm(): void {
    this.createSectionsForms();
    this.cdr.detectChanges();
  }

  createSectionsForms(): void {
    const formGroup = this.sectionsFormGroup();
    this.formSections().forEach((section) => {
      const sectionFormGroup = this.createSectionForm(section.rows);
      formGroup.addControl(section.title, sectionFormGroup);
    });
    this.sectionsFormGroup.set(formGroup);
  }

  createSectionForm(rows: DynamicRow[]): FormGroup {
    const formGroup = this.fb.group({});
    rows.forEach((dynamicRow) => {
      dynamicRow.row.forEach((field) => {
        const validations: ValidatorFn[] = [];
        if (field.validations) {
          if (field.validations.required) validations.push(Validators.required);
          if (field.validations.maxLength)
            validations.push(Validators.maxLength(field.validations.maxLength));
          if (field.validations.minLength)
            validations.push(Validators.minLength(field.validations.minLength));
          if (field.validations.pattern)
            validations.push(Validators.pattern(field.validations.pattern));
          if (field.validations.min !== undefined)
            validations.push(Validators.min(field.validations.min));
          if (field.validations.max !== undefined)
            validations.push(Validators.max(field.validations.max));
        }

        if (
          field.type === 'fromTo' &&
          field.fields &&
          field.fields.length > 0
        ) {
          const fromToGroup = this.fb.group({
            from: [field.fields[0]?.value || '', validations],
            to: [field.fields[1]?.value || '', validations],
          });
          formGroup.addControl(field.name, fromToGroup);
        } else {
          // Handle radio button values specially
          let controlValue = field.value || '';
          if (field.type === 'radio') {
            controlValue = this.getRadioButtonValue(field.value);
          }

          formGroup.addControl(
            field.name,
            this.fb.control(
              {
                value: controlValue,
                disabled: field.disabled || false,
              },
              validations
            )
          );
        }
      });
    });

    return formGroup;
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
        control.markAsDirty();
      }
    });
  }

  onSubmit(): void {
    this._skipFormValidation.set(false);
    this.isSubmitted.set(true);

    const formGroup = this.sectionsFormGroup();
    Object.values(formGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });

    this.cdr.detectChanges();

    if (formGroup.valid) {
      const combinedFormData = this.combineFormData();
      this.formData.set({
        form: combinedFormData,
        isEdit: this.data.isEdit,
      });
      this.dialogRef.close(combinedFormData);
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  combineFormData(): any {
    const formGroup = this.sectionsFormGroup();
    return Object.keys(formGroup.controls).reduce((acc: any, key) => {
      const sectionValue = (formGroup.get(key) as FormGroup)?.getRawValue();

      if (sectionValue) {
        Object.entries(sectionValue).forEach(([fieldKey, fieldValue]) => {
          acc[fieldKey] = fieldValue;
        });
      }
      return acc;
    }, {});
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  isFieldValid(fieldName: string, sectionTitle?: string): boolean {
    const formGroup = this.sectionsFormGroup();
    const control = sectionTitle
      ? formGroup.get(`${sectionTitle}.${fieldName}`)
      : formGroup.get(fieldName);

    return (
      control?.valid ||
      !(this.isSubmitted() || control?.touched || control?.dirty)
    );
  }

  isDateFieldValid(fieldName: string): boolean {
    const formGroup = this.sectionsFormGroup();
    const dateControl = formGroup.get(`פרטי בעל חיים.${fieldName}`);

    if (!dateControl || !dateControl.value) {
      return this.isFieldValid(`פרטי בעל חיים.${fieldName}`);
    }

    const dateValue = new Date(dateControl.value);

    const today = new Date();
    if (dateValue > today) {
      return false;
    }

    return this.isFieldValid(`פרטי בעל חיים.${fieldName}`);
  }

  convertToRadioOptions(
    fieldOptions: FieldOption[] | undefined
  ): RadioOption[] {
    if (!fieldOptions) {
      return [];
    }
    return fieldOptions.map((option) => ({
      value: String(option.value),
      label: option.display,
    }));
  }

  getRadioButtonValue(fieldValue: any): string {
    // Handle different value formats from database
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      // Try to find common ID properties
      if (fieldValue.genderID !== undefined) {
        return String(fieldValue.genderID);
      }
      if (fieldValue.id !== undefined) {
        return String(fieldValue.id);
      }
      if (fieldValue.value !== undefined) {
        return String(fieldValue.value);
      }
      // If no ID found, return empty string
      return '';
    }
    // If it's a primitive value, convert to string
    return String(fieldValue || '');
  }
}
