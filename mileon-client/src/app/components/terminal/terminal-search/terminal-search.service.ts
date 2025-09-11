import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { UsersFilterOptions } from '../../../types/users/usersFilterOptions';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { hoursRange } from '../../../validators/hoursRange';

@Injectable({
  providedIn: 'root',
})
export class TerminalSearchService {
  form: FormGroup;
  searchForm: FormGroup;
  private initSortOrder: SortOrder = SortOrder.asc;
  constructor(private baseFormService: BaseFormService) {
    this.form = this.baseFormService.createFormGroup(TicketFilterOptions);
    //NOTE - if search not works check this line and remove it
    this.searchForm = this.baseFormService.createFormGroup(TicketFilterOptions);
    const violationDetailsFilterGroup = this.form.get(
      'violationDetailsFilter'
    ) as FormGroup;
    if (violationDetailsFilterGroup) {
      violationDetailsFilterGroup.setValidators(
        hoursRange('fromTime', 'toTime')
      );
      violationDetailsFilterGroup.updateValueAndValidity();
    }
  }
  setInitSortOrder(dir: SortOrder) {
    this.initSortOrder = dir;
  }
  getInitSortOrder() {
    return this.initSortOrder;
  }
  setFormsOrderDirection(dir: SortOrder) {
    if (this.form) {
      this.form.get('order')?.setValue(dir);
    }
    if (this.searchForm) {
      this.searchForm.get('order')?.setValue(dir);
    }
  }
  reInitSortOrderFormsOnComponentDestroy() {
    if (this.form) {
      this.form.get('order')?.setValue(this.initSortOrder);
    }
    if (this.searchForm) {
      this.searchForm.get('order')?.setValue(this.initSortOrder);
    }
  }
  setFormsPage() {
    if (this.form) {
      this.form.get('currentPage')?.setValue(1);
    }
    if (this.searchForm) {
      this.searchForm.get('currentPage')?.setValue(1);
    }
  }
  clearForm() {
    this.form.reset();
    if (this.searchForm) {
      this.searchForm.reset();
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.get('currentPage')?.setValue(1);
      this.searchForm.get('pageSize')?.setValue(10);
      this.searchForm.get('order')?.setValue(this.initSortOrder);
    }
  }
}
