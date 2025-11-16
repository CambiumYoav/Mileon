import { Component, forwardRef, Injector, Input, OnInit, ChangeDetectionStrategy, signal, inject, computed } from '@angular/core';
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

  combinedPhoneControl = new FormControl('');
  
  // Computed signal for combined placeholder - with dash for display
  combinedPlaceholder = computed(() => 
    this._placeholderCountryCode() + '-' + this._placeholderPhoneNumber()
  );

  private isInternalUpdate = false;

  constructor() {
    super(inject(Injector));
  }

  ngOnInit(): void {
    this.checkConnectedField();

    // Subscribe to combined phone control changes
    this.combinedPhoneControl.valueChanges.subscribe((value) => {
      if (!this.isInternalUpdate) {
        // Store only digits, no formatting
        const digitsOnly = this.getDigitsOnly(value || '');
        
        if (digitsOnly !== value) {
          this.isInternalUpdate = true;
          this.combinedPhoneControl.setValue(digitsOnly, { emitEvent: false });
          this.isInternalUpdate = false;
        }
        
        // Update parent form control with digits only
        this.control.setValue(digitsOnly);
      }
    });
  }

  private getDigitsOnly(value: string): string {
    // Remove all non-digit characters
    const digitsOnly = value.replace(/\D/g, '');
    
    // Limit to 10 digits maximum
    return digitsOnly.substring(0, 10);
  }

  override writeValue(value: string): void {
    if (!value) {
      this.isInternalUpdate = true;
      this.combinedPhoneControl.setValue('', { emitEvent: false });
      this.isInternalUpdate = false;
      return;
    }

    // Always store as digits only
    const digitsOnly = this.getDigitsOnly(value);
    
    this.isInternalUpdate = true;
    this.combinedPhoneControl.setValue(digitsOnly, { emitEvent: false });
    this.isInternalUpdate = false;
  }
}