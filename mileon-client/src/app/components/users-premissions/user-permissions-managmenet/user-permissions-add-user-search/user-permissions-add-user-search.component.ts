import { Component, input, output, signal, computed, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../../services/base.service';
import { SearchByTextEnum } from '../../../../types/enum/searchByTextEnum';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { UserPermissionsAddUserSearchFormService } from './user-permissions-add-user-search-form.service';
import { SearchBarComponent } from "../../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-user-permissions-add-user-search',
  templateUrl: './user-permissions-add-user-search.component.html',
  styleUrls: ['./user-permissions-add-user-search.component.scss'],
  standalone: true,
  imports: [SearchBarComponent],
})
export class UserPermissionsAddUserSearchComponent {
  SearchByTextEnum = SearchByTextEnum;

  resultData = input<any[]>([]);
  total = input<number>(0);
  hasResultsDropdown = input<boolean>(false);
  searchData = input<UsersFilterOptions>();
  activeLegalRequestFilter = input<string>('');
  resultCountMessage = input<string>('');
  searchByText = input<SearchByTextEnum>(SearchByTextEnum.AreaSearch);
  
  search = output();
  onSearch = output<FormGroup>();
  resetTable = output();

  private usersSearchFormService = inject(UserPermissionsAddUserSearchFormService);
  private _baseService = inject(BaseService);

  infrastructureSearchForm: FormGroup;
  searchText = signal<string>('');
  filterHasValue = signal<boolean>(true);
  filterAdvanceHasValue = signal<boolean>(false);

  constructor() {
    this.infrastructureSearchForm = this.usersSearchFormService.form;
  }

  async sendFormValue(searchForm: FormGroup) {
    this.usersSearchFormService.searchForm = searchForm;
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
      this.onSearch.emit(searchForm.value);
    }
  }
}
