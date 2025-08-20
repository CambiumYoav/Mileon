import { Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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

  @Input()
  className: string = '';

  asInputElement(val: any): HTMLInputElement {
    return val;
  }

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}
}
