import { Injectable, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { InventoryFilterOptions } from '../../../types/inventory-management/inventoryFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementSearchService {
  private readonly baseFormService = inject(BaseFormService);

  form: FormGroup;
  searchForm: FormGroup;

  constructor() {
    this.form = this.baseFormService.createFormGroup(InventoryFilterOptions);
    this.searchForm = this.baseFormService.createFormGroup(
      InventoryFilterOptions
    );
  }

  clearForm(): void {
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
