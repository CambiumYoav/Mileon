import { Component, forwardRef, Injector, Input, OnInit, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConstPath } from '../../../../../constants/const_path';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material-module';

@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  styleUrls: ['./input-phone.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputPhoneComponent),
      multi: true,
    },
  ],
})
export class InputPhoneComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  private readonly _placeholderCountryCode = signal<string>('050');
  private readonly _placeholderPhoneNumber = signal<string>('0000000');
  private readonly _isValid = signal<boolean | undefined>(true);
  private readonly _errorMessage = signal<string>('');
  private readonly _className = signal<string>('');
  private readonly _isRequired = signal<boolean | undefined>(false);
  private readonly _disabled = signal<boolean>(false);

  get placeholderCountryCode(): string {
    return this._placeholderCountryCode();
  }

  get placeholderPhoneNumber(): string {
    return this._placeholderPhoneNumber();
  }

  get isValid(): boolean | undefined {
    return this._isValid();
  }

  get errorMessage(): string {
    return this._errorMessage();
  }

  get className(): string {
    return this._className();
  }

  get isRequired(): boolean | undefined {
    return this._isRequired();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  readonly Icons = ConstPath;

  combinedPhoneControl = new FormControl('');

  @Input() set placeholderCountryCode(value: string) {
    this._placeholderCountryCode.set(value);
  }

  @Input() set placeholderPhoneNumber(value: string) {
    this._placeholderPhoneNumber.set(value);
  }

  @Input() set isValid(value: boolean | undefined) {
    this._isValid.set(value);
  }

  @Input() set errorMessage(value: string) {
    this._errorMessage.set(value);
  }

  @Input() set className(value: string) {
    this._className.set(value);
  }

  @Input() set isRequired(value: boolean | undefined) {
    this._isRequired.set(value);
  }

  @Input() set disabled(value: boolean) {
    this._disabled.set(value);
  }

  constructor() {
    super(inject(Injector));
    
    effect(() => {
      const value = this.combinedPhoneControl.value;
      if (value) {
        // Format the input to ensure proper structure
        const formattedValue = this.formatPhoneNumber(value);
        if (formattedValue !== value) {
          this.combinedPhoneControl.setValue(formattedValue, { emitEvent: false });
        }
        this.control.setValue(formattedValue);
      } else {
        this.control.setValue('');
      }
    });
  }

  ngOnInit(): void {
    this.checkConnectedField();
  }

  private formatPhoneNumber(value: string): string {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // If we have at least 3 digits, format as country code + dash + phone number
    if (digitsOnly.length >= 3) {
      const countryCode = digitsOnly.substring(0, 3);
      const phoneNumber = digitsOnly.substring(3);
      return countryCode + '-' + phoneNumber;
    }
    
    return digitsOnly;
  }

  override writeValue(value: string): void {
    if (!value) {
      this.combinedPhoneControl.setValue('');
      return;
    }

    // Set the combined value
    this.combinedPhoneControl.setValue(value);
  }

  // Getter for the placeholder that combines both parts
  get combinedPlaceholder(): string {
    return this.placeholderCountryCode + '-' + this.placeholderPhoneNumber;
  }
}
