import {
  AdvancedForm,
  FieldTypeEnum,
} from '../../../types/advanced-search/form-tab.model';
import { FormGroup } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { MyRef } from '../../../types/myRef';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
})
export class AdvancedSearchComponent
  extends BaseFormComponent
  implements OnInit
{
  @Input() form!: FormGroup;

  @Input() advancedForm!: AdvancedForm;

  FieldTypeEnum = FieldTypeEnum;

  @Output() onSearch: EventEmitter<void> = new EventEmitter();

  @Input() searchButtonClicked: MyRef<boolean> = { current: false };
  renderTabs!: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {}

  search() {
    this.searchButtonClicked.current = true;
    this.onSearch.emit();
  }

  waitForFilterResponse(value: string) {
    // this.getCountryList({ name: value });
  }

  getSum(tabName: string) {
    // NOTE 🤢 ugly due to lack of dev time - needs refactor
    if (this.form) {
      // console.log('@@@@@@@@@@@@@@@@@@', this.form, tabName);

      const formGroup = this.form.controls[tabName] as FormGroup;
      const filledFieldsCount = Object.values(formGroup.controls).filter(
        (control) => {
          return !!(
            (!Array.isArray(control.value) && control.value) ||
            (Array.isArray(control.value) && !!control.value.length)
          );
        }
      ).length;
      if (filledFieldsCount) return ' (' + filledFieldsCount + ') ';
      else return '';
    }
    //otherwise
    return '';
  }

  // resetForm(tabName?: string) {
  //   // NOTE 🤢 ugly due to lack of dev time - needs refactor
  //   if (tabName) {
  //     this.form.controls[tabName].reset();
  //   } else {
  //     this.form.reset();
  //   }
  // }
  resetForm(tabName?: string) {
    // get values if they exist
    const currentOrder = this.form.get('order')?.value ?? 0;
    const currentPage = this.form.get('currentPage')?.value ?? 1;

    if (tabName) {
      this.form.controls[tabName].reset();
    } else {
      this.form.reset();

      // Restore preserved values if controls exist
      if (this.form.get('order')) {
        this.form.get('order')?.setValue(currentOrder);
      }
      if (this.form.get('currentPage')) {
        this.form.get('currentPage')?.setValue(currentPage);
      }
    }
  }
}
