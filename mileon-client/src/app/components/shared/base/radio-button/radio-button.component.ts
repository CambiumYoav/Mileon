import { 
  Component, 
  input, 
  output, 
  forwardRef, 
  signal, 
  computed,
  ChangeDetectionStrategy,
  effect
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/**
 * RadioButtonComponent with Boolean State Management - Angular 19 Signals Version
 * 
 * Features:
 * - Boolean state tracking for each option (selected: true/false)
 * - Optional deselection capability with allowDeselect
 * - Visual indicators showing selection state
 * - Events: valueChange (string) and selectionState (boolean map)
 * - Signal-based reactivity for optimal performance
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioButtonComponent),
      multi: true
    }
  ]
})
export class RadioButtonComponent implements ControlValueAccessor {
  // Signal-based inputs
  options = input<RadioOption[]>([]);
  name = input<string>('');
  value = input<string>('');
  disabled = input<boolean>(false);
  type = input<'default' | 'colored'>('default');
  direction = input<'horizontal' | 'vertical'>('horizontal');
  allowDeselect = input<boolean>(false); // Allow deselecting current option
  
  // Signal-based outputs
  valueChange = output<string>();
  selectionState = output<{[key: string]: boolean}>(); // Boolean state for each option

  // Internal state signal
  private internalValue = signal<string>('');
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Computed signals
  currentValue = computed(() => this.internalValue());
  
  selectionStateMap = computed(() => {
    const state: {[key: string]: boolean} = {};
    this.options().forEach(option => {
      state[option.value] = option.value === this.currentValue();
    });
    return state;
  });

  containerClass = computed(() => `radio-options-container ${this.direction()}`);

  constructor() {
    // Effect to emit selection state when value changes
    effect(() => {
      this.selectionState.emit(this.selectionStateMap());
    });
  }

  writeValue(value: string): void {
    this.internalValue.set(value || '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    // Note: In signal-based approach, we can't directly set input signals
    // This would need to be handled by the parent component
  }

  onRadioChange(value: string): void {
    let newValue = value;
    
    // Handle deselection if allowDeselect is true and same option is clicked
    if (this.allowDeselect() && this.currentValue() === value) {
      newValue = '';
    }
    
    this.internalValue.set(newValue);
    this.onChange(newValue);
    this.onTouched();
    this.valueChange.emit(newValue);
  }

  isOptionSelected(optionValue: string): boolean {
    return this.currentValue() === optionValue;
  }

  getOptionBooleanState(): {[key: string]: boolean} {
    return this.selectionStateMap();
  }

  setSelectionByBoolean(optionValue: string, selected: boolean): void {
    if (selected) {
      this.onRadioChange(optionValue);
    } else if (this.allowDeselect() && this.currentValue() === optionValue) {
      this.onRadioChange(optionValue); // This will deselect it
    }
  }
}
