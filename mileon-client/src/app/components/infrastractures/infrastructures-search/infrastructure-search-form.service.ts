import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { hoursRange } from '../../../validators/hoursRange';
import { InfrastructureFilterOptions } from '../../../types/infrastructure/infrastructureFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class InfrastructureSearchFormService {
  form: FormGroup;
  searchForm!: FormGroup;

  clearForm() {
    this.form.reset;
    if (this.searchForm) {
      this.searchForm.reset();
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.get('currentPage')?.setValue(1);
      this.searchForm.get('order')?.setValue(SortOrder.asc);
      this.searchForm.get('authorityID')?.setValue('');
    }
  }

  constructor(private baseFormService: BaseFormService) {
    this.form = this.baseFormService.createFormGroup(
      InfrastructureFilterOptions
    );
    // this.searchForm = this.baseFormService.createFormGroup(InfrastructureFilterOptions);
  }
}
