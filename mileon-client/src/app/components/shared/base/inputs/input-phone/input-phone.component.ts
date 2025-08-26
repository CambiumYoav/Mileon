import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { ConstPath } from '../../../../../constants/const_path';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-input-phone',
  templateUrl: './input-phone.component.html',
  styleUrls: ['./input-phone.component.scss'],
  imports: [SharedImports],
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
  Icons = ConstPath;

  @Input() placeholderCountryCode: string = '050';
  @Input() placeholderPhoneNumber: string = '0000000';
  @Input() isValid: boolean | undefined = true;
  @Input() errorMessage: string = '';
  @Input() className: string = '';
  @Input() isRequired: boolean | undefined = false;
  @Input() disabled: boolean = false;

  // Single combined control for the entire phone number
  combinedPhoneControl = new FormControl('');

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.checkConnectedField();

    // Subscribe to combined phone input changes
    this.combinedPhoneControl.valueChanges.subscribe((value) => {
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
