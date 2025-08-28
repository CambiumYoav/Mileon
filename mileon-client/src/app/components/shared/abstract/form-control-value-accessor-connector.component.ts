import { BaseFormComponent } from './../base-form/base-form.component';
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
} from '@angular/forms';
import { Component, Directive, Injector, Input, ViewChild } from '@angular/core';
import { CORE_IMPORTS } from '../../../shared/shared-modules';

@Directive() 
export abstract class FormControlValueAccessorConnector
  extends BaseFormComponent
  implements ControlValueAccessor
{
  @ViewChild(FormControlDirective, { static: true })
  formControlDirective!: FormControlDirective;

  @Input()
  formControl!: FormControl;

  @Input()
  formControlName!: string;

  @Input()
  title: string = '';

  @Input ()
  placeholder: string = '';

  @Input()
  connectedField: string | undefined = '';

  protected constructor(private injector: Injector) {
    super();
  }

  /**
   *  Use this getter in FormControl on mat-select to make connection with provided formControl of Parent
   *
   *  this.formControl => When a formControl Obj is Provided from parent
   *  this.formControl => When name of a formControl in Parent Form is Provided
   *
   */
  get control() {
    return (
      this.formControl ||
      this.controlContainer.control?.get(this.formControlName)
    );
  }

  get controlContainer() {
    return this.injector.get(ControlContainer)!;
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnTouched(fn);
  }

  registerOnChange(fn: any): void {
    this.formControlDirective?.valueAccessor?.registerOnChange(fn);
  }

  writeValue(value: any): void {
    this.formControlDirective?.valueAccessor?.writeValue(value);
  }

  setDisabledState(isDisabled: boolean): void {
    this.formControlDirective?.valueAccessor?.setDisabledState?.(isDisabled);
  }

  checkConnectedField() {
    if (this.connectedField) {
      const paramControl = this.controlContainer.control!.get(
        this.connectedField
      );
      if (paramControl) {
        this.observeAndDisableControl(paramControl);
        this.setDisabledState(!paramControl.value); // set initial state
      }
    }
  }

  observeAndDisableControl(paramControl: AbstractControl) {
    this.onValueChanges(paramControl).subscribe((value) => {
      if (value) {
        this.setDisabledState(!value || !value?.length);
      }
    });
  }
}
