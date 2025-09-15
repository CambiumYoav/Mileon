import { Component, Injector, Input, OnInit, forwardRef, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-checkbox',
  templateUrl: './input-checkbox.component.html',
  styleUrls: ['./input-checkbox.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  private readonly _className = signal<string>('');

  get className(): string {
    return this._className();
  }

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
  }
}
