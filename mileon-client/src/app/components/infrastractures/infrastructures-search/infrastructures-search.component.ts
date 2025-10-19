import { Component, signal, input, output, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../services/base.service';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import {
  InfrastructureFilterOptions,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';

@Component({
  selector: 'app-infrastructures-search',
  templateUrl: './infrastructures-search.component.html',
  styleUrls: ['./infrastructures-search.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    SearchBarComponent
  ]
})
export class InfrastructuresSearchComponent implements OnInit {
  private infrastructureSearchFormService = inject(SearchFormService);
  private _baseService = inject(BaseService);

  resultData = input<any[]>();
  total = input<number>();
  hasResultsDropdown = input<boolean>(false);
  searchData = input<InfrastructureFilterOptions>();
  activeLegalRequestFilter = input<string>();
  resultCountMessage = input<string>();
  searchByText = input<string>('');

  search = output();
  onSearch = output<FormGroup>();
  resetTable = output();

  infrastructureSearchForm = signal<FormGroup>(this.infrastructureSearchFormService.form);
  searchText = signal<string>('');
  filterHasValue = signal<boolean>(true);
  filterAdvanceHasValue = signal<boolean>(false);

  constructor() {}

  ngOnInit(): void {
    this.infrastructureSearchForm.set(this.infrastructureSearchFormService.form);
  }

  async sendFormValue(searchForm: FormGroup) {
    this.infrastructureSearchFormService.form = searchForm;
    const formValue = searchForm.value;
    for (let key of Object.keys(formValue)) {
      if (formValue[key] && typeof formValue[key] === 'object') {
        for (let k of Object.keys(formValue[key])) {
          if (k.toLowerCase().includes('time') && formValue[key][k]) {
            formValue[key][k] = this._baseService.convertTimeToDateTime(
              formValue[key][k]
            );
          }
        }
      }
      if (key.toLowerCase().includes('date') && formValue[key]) {
        this._baseService.setTimeToMidday(formValue[key]);
      }
    }
    if (searchForm.valid) {
      this.onSearch.emit(searchForm);
    }
  }
}
