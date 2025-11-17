import {
  Component,
  input,
  output,
  forwardRef,
  signal,
  computed,
  ChangeDetectionStrategy,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export interface RadioOption {
  value: string;
  label: string;
  colorClass?: string;
  selected?: boolean;
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
      multi: true,
    },
  ],
})
export class RadioButtonComponent implements ControlValueAccessor {
  options = input<RadioOption[]>([]);
  name = input<string>('');
  value = input<string>('');
  disabled = input<boolean>(false);
  type = input<'default' | 'colored'>('default');
  direction = input<'horizontal' | 'vertical'>('horizontal');
  allowDeselect = input<boolean>(false); // Allow deselecting current option
  isValid = input<boolean | undefined>(true);
  valueChange = output<string>();
  selectionState = output<{ [key: string]: boolean }>();

  private internalValue = signal<string>('');
  private onChange = (value: string) => {};
  private onTouched = () => {};

  currentValue = computed(() => this.internalValue());

  selectionStateMap = computed(() => {
    const state: { [key: string]: boolean } = {};
    this.options().forEach((option) => {
      state[option.value] = option.value === this.currentValue();
    });
    return state;
  });

  containerClass = computed(
    () => `radio-options-container ${this.direction()}`
  );

  constructor() {
    // effect(() => {
    //   this.selectionState.emit(this.selectionStateMap());
    // });
    effect(
      () => {
        const state = this.selectionStateMap();
        // Only emit if there's actually a change
        if (Object.keys(state).length > 0) {
          this.selectionState.emit(state);
        }
      }
      // { allowSignalWrites: true }
    );
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

  setDisabledState(isDisabled: boolean): void {}

  onRadioChange(value: string): void {
    let newValue = value;

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

  getOptionBooleanState(): { [key: string]: boolean } {
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
