import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormService } from '../../../shared/base-form/base-form.service';  
import { SortOrder } from '../../../../types/enum/sort-order.enum';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class UsersSearchFormService {
  form: FormGroup;
  searchForm: FormGroup;

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
    this.form = this.baseFormService.createFormGroup(UsersFilterOptions);
    this.searchForm = this.baseFormService.createFormGroup(UsersFilterOptions);
  }
}
