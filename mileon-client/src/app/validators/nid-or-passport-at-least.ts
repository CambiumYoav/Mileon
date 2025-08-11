import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';

export function atLeastOne(validator: ValidatorFn, controls: string[] = []): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!(control instanceof FormGroup)) {
      return null;
    }

    const hasAtLeastOne = controls.some(k => control.controls[k] && !validator(control.controls[k]));

    return hasAtLeastOne ? null : { atLeastOne: true };
  };
}
