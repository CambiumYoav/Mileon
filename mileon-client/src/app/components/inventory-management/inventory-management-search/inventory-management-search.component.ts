import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../services/base.service';
import { UsersFilterOptions } from '../../../types/users/usersFilterOptions';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { InventoryManagementSearchService } from './inventory-management-search.service';
import { InventoryFilterOptions } from '../../../types/inventory-management/inventoryFilterOptions';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-inventory-management-search',
  templateUrl: './inventory-management-search.component.html',
  styleUrls: ['./inventory-management-search.component.scss'],
  standalone: true,
  imports: [SearchBarComponent],
})
export class InventoryManagementSearchComponent {
  private readonly searchFormService = inject(SearchFormService);
  private readonly inventoryManagementSearchFormService = inject(
    InventoryManagementSearchService
  );
  private readonly baseService = inject(BaseService);

  @Input() resultData: any[] = [];
  @Input() total: number = 0;
  @Input() hasResultsDropdown: boolean = false;
  @Input() searchData!: UsersFilterOptions;
  @Input() activeLegalRequestFilter: string = '';
  @Input() resultCountMessage: string = '';

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<InventoryFilterOptions>();
  @Output() resetTable = new EventEmitter();

  readonly inventoryManagementSearchForm: FormGroup =
    this.inventoryManagementSearchFormService.form;

  searchText: string = '';
  filterHasValue: boolean = true;
  filterAdvanceHasValue: boolean = false;

  async sendFormValue(searchForm: FormGroup): Promise<void> {
    this.inventoryManagementSearchFormService.searchForm = searchForm;
    const formValue = searchForm.value;

    for (let key of Object.keys(formValue)) {
      if (formValue[key] && typeof formValue[key] === 'object') {
        for (let k of Object.keys(formValue[key])) {
          if (k.toLowerCase().includes('time') && formValue[key][k]) {
            formValue[key][k] = this.baseService.convertTimeToDateTime(
              formValue[key][k]
            );
          }
        }
      }
      if (key.toLowerCase().includes('date') && formValue[key]) {
        this.baseService.setTimeToMidday(formValue[key]);
      }
    }

    if (searchForm.valid) {
      this.onSearch.emit(searchForm.value);
    }
  }
}
