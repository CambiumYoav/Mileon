import { Component, Host, Input } from '@angular/core';
import { InputCheckboxGroupComponent } from '../input-checkbox-group.component';
import { CheckboxComponent } from '../../checkbox/checkbox.component';

@Component({
  selector: 'app-checkbox-group-item',
  imports: [CheckboxComponent],
  styleUrl: './checkbox-group-item.component.scss',
  template: `<div
    class="checkbox-wrapper"
    [class.checked]="checkboxGroup.isSelected(value)"
  >
    <app-checkbox
      [label]="placeholder"
      [checked]="checkboxGroup.isSelected(value)"
      (valueChanged)="onCheckboxClick($event)"
    ></app-checkbox>
  </div> `,
})
export class CheckboxGroupItemComponent {
  @Input() value: any;
  @Input() placeholder: string = '';

  constructor(@Host() public checkboxGroup: InputCheckboxGroupComponent) {}

  onCheckboxClick(checked: boolean): void {
    this.checkboxGroup.toggleValue(this.value);
  }
}
