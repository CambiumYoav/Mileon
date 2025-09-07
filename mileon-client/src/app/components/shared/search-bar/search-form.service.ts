import { SortEvent } from '../../../directives/sortable.directive';
import { Injectable, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { BaseFormComponent } from '../base-form/base-form.component';

@Injectable({
  providedIn: 'root',
})
export class SearchFormService extends BaseFormComponent {
  private readonly fb = inject(FormBuilder);

  constructor() {
    super();
    this.initializeForm();
  }

  savedValues: any;
  
  form!: FormGroup;

  private initializeForm(): void {
    this.form = this.fb.group({
      searchText: [''],
      startDate: [null],
      endDate: [null],
      orderByField: [null],
      order: [SortOrder.asc],
      currentPage: [1],
      customFilters: null,
    });
  }

  setForm(form: FormGroup) {
    this.form = form;
    this.updatePagingParams(1);
  }

  clearForm() {
    this.form.reset();
    this.form.get("searchText")?.setValue('');
    this.form.get("order")?.setValue(SortOrder.asc);
    this.form.get("currentPage")?.setValue(1);
  }

  updateSortParams({ column, direction, sortByServer }: SortEvent) {
    this.form.patchValue({
      order: SortOrder[direction as keyof typeof SortOrder],
      orderByField: column,
    });
  }

  updatePagingParams = (currentPage: number) => {
    this.form.patchValue({
      currentPage,
    });
  }
}
