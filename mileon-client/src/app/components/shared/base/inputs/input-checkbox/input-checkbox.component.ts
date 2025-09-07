import { Component, Injector, Input, OnInit, forwardRef, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxComponent),
      multi: true,
    },
  ],
})
export class InputCheckboxComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  // Angular 19 signals for reactive state management
  private readonly _className = signal<string>('');

  // Getters for template access
  get className(): string {
    return this._className();
  }

  // Inputs with setters
  @Input() set className(value: string) {
    this._className.set(value);
  }

  constructor() {
    super(inject(Injector));
  }

  asInputElement(val: any): HTMLInputElement {
    return val;
  }

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }
}
