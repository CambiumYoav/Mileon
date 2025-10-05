import { Component, OnInit, signal, computed, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SearchFormService } from '../../../../components/shared/search-bar/search-form.service';
import { BaseService } from '../../../../services/base.service';
import { AdvancedForm } from '../../../../types/advanced-search/form-tab.model';
import { PermissionsSearchFormService } from './permissions-search-form.service';
import { PermissionsFilterOptions } from '../../../../types/permission.interface';
import { SearchBarComponent } from '../../../../components/shared/search-bar/search-bar.component';

@Component({
  selector: 'app-permissions-search',
  templateUrl: './permissions-search.component.html',
  styleUrls: ['./permissions-search.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SearchBarComponent]
})
export class PermissionsSearchComponent implements OnInit {
  private readonly searchFormService = inject(SearchFormService);
  private readonly permissionsSearchFormService = inject(PermissionsSearchFormService);
  private readonly baseService = inject(BaseService);

  resultData = input<any[]>([]);
  total = input<number>(0);
  hasResultsDropdown = input<boolean>(false);
  searchData = input<PermissionsFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  activeLegalRequestFilter = input<string>('');
  resultCountMessage = input<string>('');

  search = output<any>();
  onSearch = output<PermissionsFilterOptions>();
  resetTable = output<any>();

  permissionsSearchForm = signal<FormGroup>(this.permissionsSearchFormService.form());
  searchText = signal<string>('');
  filterHasValue = signal<boolean>(true);
  filterAdvanceHasValue = signal<boolean>(false);

  hasResults = computed(() => this.resultData().length > 0);
  isFormValid = computed(() => this.permissionsSearchForm().valid);
  searchPlaceholder = computed(() => 'שם קבוצה, תיאור');
  searchTitle = computed(() => 'חיפוש קבוצות');

  constructor() {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    const searchData = this.searchData();
    if (searchData) {
      this.permissionsSearchForm().patchValue(searchData);
      this.searchText.set(searchData.searchText || '');
    }
  }

  async sendFormValue(searchForm: FormGroup): Promise<void> {
    this.permissionsSearchFormService.searchForm.set(searchForm);
    const formValue = { ...searchForm.value };
    
    const processedFormValue = this.processFormValues(formValue);
    
    if (searchForm.valid) {
      this.onSearch.emit(processedFormValue);
    }
  }

  private processFormValues(formValue: any): any {
    const processedValue = { ...formValue };
    
    for (const key of Object.keys(processedValue)) {
      if (processedValue[key] && typeof processedValue[key] === 'object') {
        for (const k of Object.keys(processedValue[key])) {
          if (k.toLowerCase().includes('time') && processedValue[key][k]) {
            processedValue[key][k] = this.baseService.convertTimeToDateTime(
              processedValue[key][k]
            );
          }
        }
      }
      if (key.toLowerCase().includes('date') && processedValue[key]) {
        this.baseService.setTimeToMidday(processedValue[key]);
      }
    }
    
    return processedValue;
  }

  onSearchTextChange(text: string): void {
    this.searchText.set(text);
  }

  onFilterChange(hasValue: boolean): void {
    this.filterHasValue.set(hasValue);
  }

  onAdvancedFilterChange(hasValue: boolean): void {
    this.filterAdvanceHasValue.set(hasValue);
  }

  resetSearch(): void {
    this.permissionsSearchFormService.clearForm();
    this.searchText.set('');
    this.filterHasValue.set(true);
    this.filterAdvanceHasValue.set(false);
    this.resetTable.emit(null);
  }
}
