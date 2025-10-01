import { Injectable, signal, computed, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseFormService } from '../../../../components/shared/base-form/base-form.service';
import { SortOrder } from '../../../../types/enum/sort-order.enum';
import { PermissionsFilterOptions } from '../../../../types/permission.interface';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';

@Injectable({
  providedIn: 'root',
})
export class PermissionsSearchFormService {
  private readonly baseFormService = inject(BaseFormService);

  // Signals for reactive state
  form = signal<FormGroup>(this.baseFormService.createFormGroup(PermissionsFilterOptions));
  searchForm = signal<FormGroup>(this.baseFormService.createFormGroup(PermissionsFilterOptions));

  // Computed signals
  isFormValid = computed(() => this.form().valid);
  isSearchFormValid = computed(() => this.searchForm().valid);
  formValue = computed(() => this.form().value);
  searchFormValue = computed(() => this.searchForm().value);

  clearForm(): void {
    this.form().reset();
    if (this.searchForm()) {
      this.searchForm().reset();
      this.searchForm().get('searchText')?.setValue('');
      this.searchForm().get('currentPage')?.setValue(1);
      this.searchForm().get('order')?.setValue(SortOrder.asc);
      this.searchForm().get('authorityID')?.setValue('');
    }
  }

  updateFormValue(value: Partial<PermissionsFilterOptions>): void {
    this.form().patchValue(value);
  }

  updateSearchFormValue(value: Partial<PermissionsFilterOptions>): void {
    this.searchForm().patchValue(value);
  }

  resetForm(): void {
    this.form().reset();
  }

  resetSearchForm(): void {
    this.searchForm().reset();
  }

  getFormControl(controlName: string) {
    return this.form().get(controlName);
  }

  getSearchFormControl(controlName: string) {
    return this.searchForm().get(controlName);
  }
}
