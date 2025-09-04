import { EventEmitter, Injectable } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, pairwise, startWith } from 'rxjs';
import { DynamicField } from '../../types/infrastructure/InfrastructureTypes';
import {
  NewSettingsFieldData,
  SettingField,
  SettingsFieldUpdate,
  TableConfig,
} from '../../types/timeline-settings/timeline-settings-types';
import { TimelineService } from './timeline.service';
import { TimelineApi } from '../../types/enum/timelineSettings.enum';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';

@Injectable({
  providedIn: 'root',
})
export class TimelineSettingsFormService {
  constructor(
    private fb: FormBuilder,
    private timelineService: TimelineService,
    private toaster: ToastrService
  ) {}

  private formDataSubject = new BehaviorSubject<any>({});

  private dynamicForm: FormGroup = new FormGroup({});

  private fields: SettingField[] = [];

  private changedFields: SettingsFieldUpdate[] = [];

  formSubmitted: boolean = false;

  get formData$() {
    return this.formDataSubject.asObservable();
  }

  submitForm: EventEmitter<void> = new EventEmitter();

  triggerSubmit() {
    if (this.getForm().valid) {
      this.timelineService
        .updateEnforcementSettings(this.changedFields)
        .then((result: TimelineApi) => {
          if (result === TimelineApi.EnforcementSettingsUpdates) {
            this.toaster.success(ErrorSuccessMessages.SUCCESS);
          } else {
            this.toaster.error(ErrorSuccessMessages.DEFAULT);
          }
        });
    }
    this.submitForm.emit();
  }

  // receive all the settings fields and construct a form based on the fields.
  initializeForm(fields: SettingField[]): void {
    this.fields = fields;
    const formGroups: Record<string, FormGroup> = {};

    fields.forEach((field) => {
      const category = field.settingsCategory;
      formGroups[category] ??= this.fb.group({});

      const fieldValue =
        field.valueType === 'int' ? Number(field.value) : field.value;
      formGroups[category].addControl(field.name, this.fb.control(fieldValue));
    });

    this.dynamicForm = this.fb.group(formGroups);
    this.formDataSubject.next(this.dynamicForm);

    this.trackFormChanges();
  }

  // track changes to the form and build an updated array for those fields
  private trackFormChanges(): void {
    this.dynamicForm.valueChanges
      .pipe(startWith(this.dynamicForm.value), pairwise())
      // .subscribe(([prev, curr]) => {
      //   const changedFields = this.getChangedFields(prev, curr);
      //   changedFields.forEach((field) => this.handleChangedData(field));
      //   this.formDataSubject.next(this.dynamicForm);
      // });
  }

  // find which field of which category was changes so that a specific object can be build
  // private getChangedFields(
  //   prev: TableConfig,
  //   curr: TableConfig
  // ): NewSettingsFieldData[] {
  //   return Object.keys(curr).flatMap((section) =>
  //     Object.keys(curr[section] || {}).reduce((acc, field) => {
  //       if (prev[section]?.[field] !== curr[section][field]) {
  //         acc.push({ section, field, currValue: curr[section][field] });
  //       }
  //       return acc;
  //     }, [] as NewSettingsFieldData[])
  //   );
  // }

  //build an array in order to update the settings fields (server expects a curtain type of objects of id and value)
  handleChangedData(updatedField: {
    section: string;
    field: string;
    currValue: any;
  }): void {
    const settingsField = this.fields.find(
      (field: SettingField) =>
        field.settingsCategory === updatedField.section &&
        field.name === updatedField.field
    );

    if (!settingsField) return;

    const existingField = this.changedFields.find(
      (field: SettingsFieldUpdate) => field.id === settingsField.id
    );
    if (existingField) {
      existingField.value = updatedField.currValue.toString();
    } else {
      this.changedFields.push({
        id: settingsField.id,
        value: updatedField.currValue.toString(),
      });
    }
  }

  applyValidators(inputFields: { [key: string]: DynamicField[] }): void {
    if (this.dynamicForm) {
      Object.entries(inputFields).forEach(([category, fields]) => {
        const categoryGroup = this.dynamicForm?.get(category) as FormGroup;
        if (categoryGroup) {
          fields.forEach((field) => {
            const control = categoryGroup.get(field.name);

            if (control) {
              const validators = this.createValidators(field.validations);
              control.setValidators(validators);
              control.updateValueAndValidity();
            }
          });
        }
      });
      this.formDataSubject.next(this.dynamicForm);
    }
  }

  createValidators(fieldValidations: any): ValidatorFn[] {
    const validators: ValidatorFn[] = [];

    if (fieldValidations) {
      if (fieldValidations.required) validators.push(Validators.required);
      if (fieldValidations.maxLength)
        validators.push(Validators.maxLength(fieldValidations.maxLength));
      if (fieldValidations.minLength)
        validators.push(Validators.minLength(fieldValidations.minLength));
      if (fieldValidations.pattern)
        validators.push(Validators.pattern(fieldValidations.pattern));
      if (fieldValidations.min !== undefined)
        validators.push(Validators.min(fieldValidations.min));
      if (fieldValidations.max !== undefined)
        validators.push(Validators.max(fieldValidations.max));
    }
    return validators;
  }

  // Retrieve the current form
  getForm(): FormGroup {
    return this.dynamicForm;
  }

  // Update a specific field
  updateField(name: string, value: any): void {
    if (this.dynamicForm.contains(name)) {
      this.dynamicForm.get(name)?.setValue(value);
    }
  }

  // Retrieve specific values
  getFieldValue(name: string): any {
    return this.dynamicForm.get(name)?.value;
  }
}
