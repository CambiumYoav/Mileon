import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * RadioButtonComponent with Boolean State Management
 * 
 * Features:
 * - Boolean state tracking for each option (selected: true/false)
 * - Optional deselection capability with allowDeselect
 * - Visual indicators showing selection state
 * - Events: valueChange (string) and selectionState (boolean map)
 */

export interface RadioOption {
  value: string;
  label: string;
  colorClass?: string;
  selected?: boolean; // Boolean state for option selection
}

@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-button.component.html',
  styleUrl: './radio-button.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent implements ControlValueAccessor {
  @Input() options: RadioOption[] = [];
  @Input() name: string = '';
  @Input() value: string = '';
  @Input() disabled: boolean = false;
  @Input() type: 'default' | 'colored' = 'default';
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() allowDeselect: boolean = false; // Allow deselecting current option
  
  @Output() valueChange = new EventEmitter<string>();
  @Output() selectionState = new EventEmitter<{[key: string]: boolean}>(); // Boolean state for each option

  private onChange = (value: string) => {};
  private onTouched = () => {};

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onRadioChange(value: string): void {
    // Handle deselection if allowDeselect is true and same option is clicked
    if (this.allowDeselect && this.value === value) {
      this.value = '';
      value = '';
    } else {
      this.value = value;
    }
    
    this.onChange(this.value);
    this.onTouched();
    this.valueChange.emit(this.value);
    
    // Emit boolean state for each option
    this.emitSelectionState();
  }

  emitSelectionState(): void {
    const state: {[key: string]: boolean} = {};
    this.options.forEach(option => {
      state[option.value] = option.value === this.value;
    });
    this.selectionState.emit(state);
  }

  isOptionSelected(optionValue: string): boolean {
    return this.value === optionValue;
  }

  getOptionBooleanState(): {[key: string]: boolean} {
    const state: {[key: string]: boolean} = {};
    this.options.forEach(option => {
      state[option.value] = option.value === this.value;
    });
    return state;
  }

  setSelectionByBoolean(optionValue: string, selected: boolean): void {
    if (selected) {
      this.onRadioChange(optionValue);
    } else if (this.allowDeselect && this.value === optionValue) {
      this.onRadioChange(optionValue); // This will deselect it
    }
  }

  getContainerClass(): string {
    return `radio-options-container ${this.direction}`;
  }
}
