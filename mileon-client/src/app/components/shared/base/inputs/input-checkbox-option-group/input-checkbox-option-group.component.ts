import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { ConstPath } from '../../../../../constants/const_path';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

export interface CheckboxOption {
  value: string | number | any;
  label: string;
  checked?: boolean;
}

@Component({
  selector: 'app-input-checkbox-option-group',
  templateUrl: './input-checkbox-option-group.component.html',
  styleUrls: ['./input-checkbox-option-group.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InputCheckboxOptionGroupComponent implements OnInit {
  private readonly _options = signal<CheckboxOption[]>([]);
  private readonly _cssWrapperClass = signal<string>('');
  private readonly _isDisabled = signal<boolean>(false);
  private readonly _title = signal<string>('');
  private readonly _isValid = signal<boolean | undefined>(true);
  private readonly _isRequired = signal<boolean | undefined>(false);
  private readonly _selectedValues = signal<number[]>([]);

  readonly selectedValues = computed(() => this._selectedValues());

  get options(): CheckboxOption[] {
    return this._options();
  }

  get cssWrapperClass(): string {
    return this._cssWrapperClass();
  }

  get isDisabled(): boolean {
    return this._isDisabled();
  }

  get title(): string {
    return this._title();
  }

  get isValid(): boolean | undefined {
    return this._isValid();
  }

  get isRequired(): boolean | undefined {
    return this._isRequired();
  }

  readonly Icons = ConstPath;

  @Output() selectionChange: EventEmitter<number[]> = new EventEmitter();

  @Input() set options(value: CheckboxOption[]) {
    this._options.set(value);
    this.initializeSelectedValues();
  }

  @Input() set cssWrapperClass(value: string) {
    this._cssWrapperClass.set(value);
  }

  @Input() set isDisabled(value: boolean) {
    this._isDisabled.set(value);
  }

  @Input() set title(value: string) {
    this._title.set(value);
  }

  @Input() set isValid(value: boolean | undefined) {
    this._isValid.set(value);
  }

  @Input() set isRequired(value: boolean | undefined) {
    this._isRequired.set(value);
  }

  ngOnInit(): void {
    this.initializeSelectedValues();
  }

  private initializeSelectedValues(): void {
    const options = this._options();
    const selectedValues = options
      .filter((option) => option.checked)
      .map((option) => Number(option.value));

    this._selectedValues.set(selectedValues);

    options.forEach((option) => {
      option.checked = selectedValues.includes(Number(option.value));
    });
  }

  toggleCheckbox(value: number | string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const numericValue = Number(value);
    const currentSelectedValues = this._selectedValues();

    let newSelectedValues: number[];
    if (checked) {
      if (!currentSelectedValues.includes(numericValue)) {
        newSelectedValues = [...currentSelectedValues, numericValue];
      } else {
        newSelectedValues = currentSelectedValues;
      }
    } else {
      newSelectedValues = currentSelectedValues.filter(
        (val) => val !== numericValue
      );
    }

    this._selectedValues.set(newSelectedValues);

    // sync option.checked
    const options = this._options();
    options.forEach((option) => {
      option.checked = newSelectedValues.includes(Number(option.value));
    });

    this.selectionChange.emit([...newSelectedValues]);
  }

  writeValue(value: number[] | undefined): void {
    const newSelectedValues = Array.isArray(value) ? value.map(Number) : [];
    this._selectedValues.set(newSelectedValues);

    const options = this._options();
    options.forEach((option) => {
      option.checked = newSelectedValues.includes(Number(option.value));
    });
  }
}
