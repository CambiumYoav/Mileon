import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {
  Field,
  FieldTypeEnum,
} from '../../../types/advanced-search/form-tab.model';
import { SendEmailDialogFields } from '../../../types/dialog/sendEmailDialogOptions';
import { MyRef } from '../../../types/myRef';
import { CheckboxComponent } from '../base/checkbox/checkbox.component';
import { InputCheckboxGroupComponent } from '../base/input-checkbox-group/input-checkbox-group.component';
import { CheckboxGroupItemComponent } from '../base/input-checkbox-group/checkbox-group-item/checkbox-group-item.component';

@Component({
  selector: 'app-toggle-checkbox-group',
  imports: [
    InputCheckboxGroupComponent,
    CheckboxComponent,
    CheckboxGroupItemComponent,
  ],
  templateUrl: './toggle-checkbox-group.component.html',
  styleUrl: './toggle-checkbox-group.component.scss',
})
export class ToggleCheckboxGroupComponent {
  @Input()
  isAllCheckboxesChecked: MyRef<boolean> = { current: false };

  @Input() field!: Field;

  @Input() form!: FormGroup;

  FieldTypeEnum = FieldTypeEnum;

  @Input()
  fileTypesIDs = SendEmailDialogFields.getIds();

  @Input()
  patchFormKey: string = 'fileTypes';

  @Input()
  checkboxesValues: MyRef<any[]> = { current: [] };

  constructor() {}

  handleAllDocsCheckboxChange(checked: boolean) {
    // Main checkbox state
    this.isAllCheckboxesChecked.current = checked;

    // Values of all checkboxes
    this.checkboxesValues.current = checked ? [...this.fileTypesIDs] : [];

    // Update form control
    this.form.patchValue({
      [this.patchFormKey]: this.checkboxesValues.current,
    });
  }
}
