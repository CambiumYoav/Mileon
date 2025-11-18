import { Component, Injector, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { MyRef } from '../../../../types/myRef';
import { FormControlValueAccessorConnector } from '../../abstract/form-control-value-accessor-connector.component';

@Component({
  selector: 'app-input-checkbox-group',
  imports: [],
  template: '<ng-content></ng-content>',
})
export class InputCheckboxGroupComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  @Input() value: MyRef<any[]> = { current: [] };
  @Input() isAllCheckboxesChecked: MyRef<boolean> = { current: false };

  constructor(injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {}

  toggleValue(selectedValue: string): void {
    const current = this.value.current ?? [];
    const index = current.indexOf(selectedValue);

    let next: any[];

    if (index === -1) {
      // add
      next = [...current, selectedValue];
    } else {
      // remove
      next = [...current];
      next.splice(index, 1);

      if (this.isAllCheckboxesChecked.current) {
        this.isAllCheckboxesChecked.current = false;
      }
    }

    this.value.current = next;
    this.control.patchValue(next);
  }

  isSelected(valueToCheck: string): boolean {
    return this.value.current.includes(valueToCheck);
  }

  // Helper method to get current values (useful for debugging)
  getCurrentValues(): any[] {
    return [...this.value.current];
  }

  // Clear all selections
  clearAll(): void {
    this.value.current = [];
    this.isAllCheckboxesChecked.current = false;
    this.control.patchValue([]);
  }

  // Select all (if you need this functionality)
  selectAll(allValues: any[]): void {
    this.value.current = [...allValues];
    this.isAllCheckboxesChecked.current = true;
    this.control.patchValue(this.value.current);
  }
}
