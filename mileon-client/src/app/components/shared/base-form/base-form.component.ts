import { Component } from '@angular/core';
import { SharedImports } from '../../../shared/shared-modules';
import { FormGroup, FormControl, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, distinctUntilChanged, takeUntil, debounceTime } from 'rxjs';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-base-form',
  imports: [SharedImports],
  templateUrl: './base-form.component.html',
  styleUrl: './base-form.component.scss',
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
    // firstForm.addControl(controlName, secondForm[controlName]);
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
