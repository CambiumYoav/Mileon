import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormService } from '../../../../components/shared/base-form/base-form.service';  
import { SortOrder } from '../../../../types/enum/sort-order.enum';
import { UsersPermissionsFilterOptions } from '../../../../types/user-permissions/userPermissionFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class UserPermissionsAddUserSearchFormService {
  private baseFormService = inject(BaseFormService);
  
  form: FormGroup;
  searchForm: FormGroup;

  constructor() {
    this.form = this.baseFormService.createFormGroup(
      UsersPermissionsFilterOptions
    );
    this.searchForm = this.baseFormService.createFormGroup(
      UsersPermissionsFilterOptions
    );
  }

  clearForm() {
    this.form.reset();
    if (this.searchForm) {
      this.searchForm.reset();
      this.searchForm.get('searchText')?.setValue('');
      this.searchForm.get('currentPage')?.setValue(1);
      this.searchForm.get('order')?.setValue(SortOrder.asc);
      this.searchForm.get('authorityID')?.setValue('');
    }
  }
}
