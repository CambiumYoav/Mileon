import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConstPath } from '../../../../../constants/const_path';
import { SharedImports } from '../../../../../shared/shared-modules';

export interface CheckboxOption {
  value: string | number | any;
  label: string;
  checked?: boolean;
}
@Component({
  selector: 'app-input-checkbox-option-group',
  templateUrl: './input-checkbox-option-group.component.html',
  styleUrls: ['./input-checkbox-option-group.component.scss'],
  imports: [SharedImports],
})
export class InputCheckboxOptionGroupComponent implements OnInit {
  Icons = ConstPath;
  @Input() options: CheckboxOption[] = [];
  @Input()
  public cssWrapperClass: string = '';
  @Input()
  isDisabled: boolean = false;
  @Input() title: string = '';
  @Input()
  isValid: boolean | undefined = true;
  @Input() isRequired: boolean | undefined = false;
  @Output()
  selectionChange: EventEmitter<number[]> = new EventEmitter();

  selectedValues: number[] = [];
  ngOnInit(): void {
    // initialize selectedValues from checked options
    this.selectedValues = this.options
      .filter((option) => option.checked)
      .map((option) => Number(option.value));

    // sync option.checked
    this.options.forEach((option) => {
      option.checked = this.selectedValues.includes(Number(option.value));
    });
  }

  toggleCheckbox(value: number | string, event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    const numericValue = Number(value);

    if (checked) {
      if (!this.selectedValues.includes(numericValue)) {
        this.selectedValues.push(numericValue);
      }
    } else {
      this.selectedValues = this.selectedValues.filter(
        (val) => val !== numericValue
      );
    }

    // sync option.checked
    this.options.forEach((option) => {
      option.checked = this.selectedValues.includes(Number(option.value));
    });

    this.selectionChange.emit([...this.selectedValues]);
  }

  writeValue(value: number[] | undefined): void {
    this.selectedValues = Array.isArray(value) ? value.map(Number) : [];

    this.options.forEach((option) => {
      option.checked = this.selectedValues.includes(Number(option.value));
    });
  }
}
