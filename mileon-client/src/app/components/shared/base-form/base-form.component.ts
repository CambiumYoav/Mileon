import {
  FormGroup,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormControl,
} from '@angular/forms';
import { Component } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { BaseComponent } from '../base/base.component'; 
import { takeUntil, debounceTime, Observable } from 'rxjs';
import { SharedImports } from '../../../shared/shared-modules';


@Component({
  selector: 'app-base-form',
  template: ``,
  styles: [''],
  imports: [SharedImports],
})
export class BaseFormComponent extends BaseComponent {
  constructor() {
    super();
  }

  formChangeWithDebounce(
    form: FormGroup | FormControl | AbstractControl,
    time?: number
  ): Observable<any> {
    return form.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.componentDestroyed$),
      debounceTime(time || 250)
    );
  }

  onValueChanges(form: FormGroup | AbstractControl): Observable<any> {
    return form.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.componentDestroyed$)
    );
  }

  getValues(form: FormGroup | { [key: string]: AbstractControl }) {
    return Object.values(form);
  }

  checkIfExistsAndValid(
    controls: { [key: string]: AbstractControl } | FormControl
  ) {
    return (
      controls &&
      !!Object.values(controls).filter((c) => !!c.value && c.valid).length
    );
  }

  concatFormControls(
    firstForm: FormGroup,
    secondForm:
      | FormGroup
      | {
        [key: string]: AbstractControl;
      },
    controlName: string
  ) {
    firstForm.addControl(controlName, secondForm[controlName as keyof typeof secondForm] as FormControl);
  }

  atLeastOneValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    let controls = (control as FormGroup).controls;
    if (controls) {
      let theOne = Object.keys(controls).findIndex(
        (key) => !!controls[key].value && !!controls[key].value.length
      );
      if (theOne === -1) {
        return {
          atLeastOneRequired: {
            text: 'At least one should be selected',
          },
        };
      }
    }
    return null;
  };
}
