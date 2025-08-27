import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptionsNew';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { hoursRange } from '../../../validators/hoursRange';

@Injectable({
  providedIn: 'root',
})
export class TicketsSearchFormService {
  form: FormGroup;
  searchForm: FormGroup;

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

  clearForm() {
    this.form.reset;
    if (this.searchForm) {
      this.searchForm.reset();
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.get('currentPage')?.setValue(1);
      this.searchForm.get('order')?.setValue(SortOrder.asc);
    }
  }
}
