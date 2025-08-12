import { Injectable, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { DynamicRow } from '../types/infrastructure/InfrastructureTypes';

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService {
  private fb = inject(FormBuilder);
  constructor() {}

  buildForm(fields: DynamicRow[]): FormGroup {
    const group: any = {};

    fields[0].row.forEach((field) => {
      const control = this.fb.control(
        field.value || '',
        this.getFieldValidations(field)
      );
      group[field.name] = control;
    });

    return this.fb.group(group);
  }

  private getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const v = field.validations;

    if (!v) return validations;

    if (v.required) validations.push(Validators.required);
    if (field.name === 'url') validations.push(this.subdomainValidator());
    if (v.pattern) validations.push(Validators.pattern(v.pattern));
    if (v.minLength) validations.push(Validators.minLength(v.minLength));
    if (v.maxLength) validations.push(Validators.maxLength(v.maxLength));

    return validations;
  }

  private subdomainValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const raw = control.value || '';
      const value = raw.replace(/^https?:\/\//, ''); // remove prefix

      const valid = /^[a-zA-Z0-9-]+$/.test(value);
      return valid
        ? null
        : { pattern: { actualValue: raw, requiredPattern: '^[a-zA-Z0-9-]+$' } };
    };
  }
}
