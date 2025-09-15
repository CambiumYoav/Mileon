import { Component, Inject, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ConstPath } from '../../../constants/const_path';   
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { BaseComponents, SharedImports } from '../../../shared/shared-modules';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';

@Component({
  selector: 'app-infrastructures-form-wrapper',
  templateUrl: './infrastructures-form-wrapper.component.html',
  styleUrls: ['./infrastructures-form-wrapper.component.scss'],
  imports: [...SharedImports, ...BaseComponents]
})
export class InfrastructuresFormWrapperComponent implements OnInit {
  Icons = ConstPath;
  mainTitle: string = '';
  sectionsFormGroup: FormGroup; 
  formSections: { title: string; rows: DynamicRow[] }[] = [];
  dataSubject = new Subject<any>();
  isSubmitted = false;
  private _skipFormValidation = false;
FieldTypeEnum = FieldTypeEnum;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InfrastructureFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      mainTitle: string;
      isEdit: boolean;
      sections: { title: string; rows: DynamicRow[] }[];
    },
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {
    this.mainTitle = data.mainTitle;
    this.formSections = data.sections;
    this.sectionsFormGroup = this.fb.group({});
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.createSectionsForms();

    this.cdr.detectChanges();
  }

  createSectionsForms(): void {
    this.formSections.forEach((section) => {
      const formGroup = this.createSectionForm(section.rows);
      this.sectionsFormGroup.addControl(section.title, formGroup);
    });
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

        if (field.type === 'fromTo' && field.fields && field.fields.length > 0) {
          const fromToGroup = this.fb.group({
            from: [field.fields[0]?.value || '', validations],
            to: [field.fields[1]?.value || '', validations],
          });
          formGroup.addControl(field.name, fromToGroup);
        } else {
          formGroup.addControl(
            field.name,
            this.fb.control(
              {
                value: field.value || '',
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
    this._skipFormValidation = false;
    this.isSubmitted = true;

    Object.values(this.sectionsFormGroup.controls).forEach((control) => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });

    this.cdr.detectChanges();

    if (this.sectionsFormGroup.valid) {
      const combinedFormData = this.combineFormData();
      this.dataSubject.next({
        form: combinedFormData,
        isEdit: this.data.isEdit,
      });
      this.dialogRef.close(combinedFormData);
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  combineFormData(): any {
    return Object.keys(this.sectionsFormGroup.controls).reduce((acc: any, key) => {
      const sectionValue = (
        this.sectionsFormGroup.get(key) as FormGroup
      )?.getRawValue();

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
    const control = sectionTitle
      ? this.sectionsFormGroup.get(`${sectionTitle}.${fieldName}`)
      : this.sectionsFormGroup.get(fieldName);

    return (
      control?.valid ||
      !(this.isSubmitted || control?.touched || control?.dirty)
    );
  }

  isDateFieldValid(fieldName: string): boolean {
    const dateControl = this.sectionsFormGroup.get(
      `פרטי בעל חיים.${fieldName}`
    );

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
}
