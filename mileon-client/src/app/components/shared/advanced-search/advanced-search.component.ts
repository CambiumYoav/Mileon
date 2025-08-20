import {
  AdvancedForm,
  FieldTypeEnum,
} from '../../../types/advanced-search/form-tab.model';
import { FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { MyRef } from '../../../types/myRef';
import { SelectComponent } from "../base/select/select.component";
import { InputTextComponent } from "../base/inputs/input-text/input-text.component";
import { InputCheckboxComponent } from "../base/inputs/input-checkbox/input-checkbox.component";
import { InputDateComponent } from "../base/inputs/input-date/input-date.component";
import { DateTimeComponent } from "../base/date-time/date-time.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  standalone: true,
  imports: [SelectComponent, InputTextComponent, InputCheckboxComponent, InputDateComponent, DateTimeComponent, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatIconModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AdvancedSearchComponent),
      multi: true,
    },
  ],
})
export class AdvancedSearchComponent
  extends BaseFormComponent
  implements OnInit
{
  @Input() form: FormGroup | null = null;

  @Input() advancedForm: AdvancedForm | null = null;

  FieldTypeEnum = FieldTypeEnum;

  @Output() onSearch: EventEmitter<void> = new EventEmitter();

  @Input() searchButtonClicked: MyRef<boolean> = { current: false };
  renderTabs!: boolean;

  constructor() {
    super();
  }

  ngOnInit(): void {
    // Ensure required inputs are provided
    if (!this.advancedForm) {
      console.warn('AdvancedSearchComponent: advancedForm input is required but not provided');
    }
    if (!this.form) {
      console.warn('AdvancedSearchComponent: form input is required but not provided');
    }
  }

  search() {
    if (!this.form) {
      console.warn('Cannot search: form is not initialized');
      return;
    }
    this.searchButtonClicked.current = true;
    this.onSearch.emit();
  }

  waitForFilterResponse(value: string) {
    // this.getCountryList({ name: value });
  }

  getSum(tabName: string) {
    // NOTE 🤢 ugly due to lack of dev time - needs refactor
    if (this.form && this.advancedForm) {
      // console.log('@@@@@@@@@@@@@@@@@@', this.form, tabName);

      const formGroup = this.form.controls[tabName] as FormGroup;
      if (!formGroup) {
        return '';
      }
      
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
    const currentOrder = this.form?.get('order')?.value ?? 0;
    const currentPage = this.form?.get('currentPage')?.value ?? 1;

    if (tabName) {
      this.form?.controls[tabName].reset();
    } else {
      this.form?.reset();

      // Restore preserved values if controls exist
      if (this.form?.get('order')) {
        this.form?.get('order')?.setValue(currentOrder);
      }
      if (this.form?.get('currentPage')) {
        this.form?.get('currentPage')?.setValue(currentPage);
      }
    }
  }
}
