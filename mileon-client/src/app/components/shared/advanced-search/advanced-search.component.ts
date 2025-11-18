import { ButtonComponent } from './../base/button/button.component';
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
  OnDestroy,
  Output,
  Renderer2,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  effect,
} from '@angular/core';
import { BaseFormComponent } from '../base-form/base-form.component';
import { MyRef } from '../../../types/myRef';
import { SelectComponent } from "../base/select/select.component";
import { InputTextComponent } from "../base/inputs/input-text/input-text.component";
import { InputCheckboxComponent } from "../base/inputs/input-checkbox/input-checkbox.component";
import { InputDateComponent } from "../base/inputs/input-date/input-date.component";
import { DateTimeComponent } from "../base/date-time/date-time.component";
import { InputPhoneComponent } from "../base/inputs/input-phone/input-phone.component";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { InputSizeEnum } from '../../../types/enum/inputSizeEnum';
import { FieldSize } from '../../../types/advanced-search/form-tab.model';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonComponent,SelectComponent, InputTextComponent, InputCheckboxComponent, InputDateComponent, DateTimeComponent, InputPhoneComponent, MatTabsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule, MatDatepickerModule, MatIconModule, MatButtonModule, CommonModule, ReactiveFormsModule],
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
  implements OnInit, OnDestroy
{
  private readonly _form = signal<FormGroup | null>(null);
  private readonly _advancedForm = signal<AdvancedForm | null>(null);
  private readonly _isSearching = signal(false);
  private readonly _hasAnyFilledFieldsSignal = signal(false);
  private readonly _renderTabs = signal<boolean>(false);

  get form(): FormGroup | null {
    return this._form();
  }

  get advancedForm(): AdvancedForm | null {
    return this._advancedForm();
  }

  get renderTabs(): boolean {
    return this._renderTabs();
  }

  readonly isSearching = this._isSearching.asReadonly();
  readonly hasAnyFilledFieldsSignal = this._hasAnyFilledFieldsSignal.asReadonly();

  readonly FieldTypeEnum = FieldTypeEnum;
  readonly InputSizeEnum = InputSizeEnum;

  @Output() onSearch: EventEmitter<void> = new EventEmitter();

  @Input() set form(value: FormGroup | null) {
    this._form.set(value);
    if (value) {
      this.setupFormReactivity();
    }
  }

  @Input() set advancedForm(value: AdvancedForm | null) {
    this._advancedForm.set(value);
    this._renderTabs.set(!!value);
  }

  @Input() searchButtonClicked: MyRef<boolean> = { current: false };

  constructor() {
    super();
    
    effect(() => {
      const form = this._form();
      if (form) {
        this.updateHasAnyFilledFieldsSignal();
      }
    });
  }

  ngOnInit(): void {
    if (!this._advancedForm()) {
      console.warn('AdvancedSearchComponent: advancedForm input is required but not provided');
    }
    if (!this._form()) {
      console.warn('AdvancedSearchComponent: form input is required but not provided');
    }

  }

  private setupFormReactivity(): void {
  }

  search() {
    const form = this._form();
    if (!form) {
      console.warn('Cannot search: form is not initialized');
      return;
    }
    this._isSearching.set(true);
    this.searchButtonClicked.current = true;
    this.onSearch.emit();
    
    // Reset searching state after a short delay
    setTimeout(() => {
      this._isSearching.set(false);
    }, 1000);
  }

  waitForFilterResponse(value: string) {
    // this.getCountryList({ name: value });
  }

  getSum(tabName: string) {
    // NOTE 🤢 ugly due to lack of dev time - needs refactor
    const form = this._form();
    const advancedForm = this._advancedForm();
    
    if (form && advancedForm) {
      const formGroup = form.controls[tabName] as FormGroup;
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

  hasAnyFilledFields(): boolean {
    const form = this._form();
    const advancedForm = this._advancedForm();
    
    if (!form || !advancedForm) {
      return false;
    }

    const tabs = advancedForm.tabs || [];
    return tabs.some((tab) => {
      const tabName = tab.name || '';
      const formGroup = form?.controls[tabName] as FormGroup;
      if (!formGroup) {
        return false;
      }

      const filledFieldsCount = Object.values(formGroup.controls).filter((control) => {
        return !!(
          (!Array.isArray(control.value) && control.value) ||
          (Array.isArray(control.value) && !!control.value.length)
        );
      }).length;

      return filledFieldsCount > 0;
    });
  }

  /**
   * Update the signal for hasAnyFilledFields - call this when form changes
   */
  updateHasAnyFilledFieldsSignal(): void {
    const hasFilled = this.hasAnyFilledFields();
    this._hasAnyFilledFieldsSignal.set(hasFilled);
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
    const form = this._form();
    if (!form) return;

    // get values if they exist
    const currentOrder = form.get('order')?.value ?? 0;
    const currentPage = form.get('currentPage')?.value ?? 1;

    if (tabName) {
      form.controls[tabName].reset();
    } else {
      form.reset();

      // Restore preserved values if controls exist
      if (form.get('order')) {
        form.get('order')?.setValue(currentOrder);
      }
      if (form.get('currentPage')) {
        form.get('currentPage')?.setValue(currentPage);
      }
    }

    // Update the signal after form reset
    this.updateHasAnyFilledFieldsSignal();
  }

  getInputSize(fieldSize: FieldSize | undefined): InputSizeEnum {
    if (!fieldSize) return InputSizeEnum.Base;
    
    switch (fieldSize) {
      case FieldSize.Small:
        return InputSizeEnum.Sm;
      case FieldSize.Medium:
        return InputSizeEnum.Md;
      case FieldSize.Large:
        return InputSizeEnum.Lg;
      case FieldSize.ExtraLarge:
        return InputSizeEnum.Xl;
      default:
        return InputSizeEnum.Base;
    }
  }

  /**
   * TrackBy function for tab rows - creates unique identifier combining multiple properties
   */
  trackByRow(index: number, row: any): any {
    // Always include index to ensure uniqueness, even if other properties are the same
    const rowName = row.name || '';
    const groupLength = row.group?.length || 0;
    return `row_${index}_${rowName}_${groupLength}`;
  }

  /**
   * TrackBy function for fields - creates unique identifier combining multiple properties
   */
  trackByField(index: number, field: any): any {
    // Always include index to ensure uniqueness, even if other properties are the same
    const fieldName = field.name || '';
    const fieldType = field.type || '';
    const fieldLength = field.length || '';
    return `field_${index}_${fieldName}_${fieldType}_${fieldLength}`;
  }

  /**
   * Helper method to convert readonly array to mutable array for template binding
   */
  getBindLabelKeys(bindLabelKeys: readonly string[] | undefined): string[] | undefined {
    return bindLabelKeys ? [...bindLabelKeys] : undefined;
  }

  override ngOnDestroy(): void {
    // BaseFormComponent handles the cleanup via componentDestroyed$
    super.ngOnDestroy();
  }
}
