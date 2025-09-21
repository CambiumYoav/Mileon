import { Component, EventEmitter, Input, OnInit, Output, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SearchFormService } from '../../../shared/search-bar/search-form.service';
import { BaseService } from '../../../../services/base.service';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { UsersSearchFormService } from './users-search-form.service';
import { SearchByTextEnum } from '../../../../types/enum/searchByTextEnum';
import { SearchBarComponent } from "../../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.scss'],
  imports: [SearchBarComponent],
})
export class UsersSearchComponent implements OnInit {
  private readonly searchFormService = inject(SearchFormService);
  private readonly usersSearchFormService = inject(UsersSearchFormService);
  private readonly _baseService = inject(BaseService);

  readonly SearchByTextEnum = SearchByTextEnum;

  @Input() resultData: any[] = [];
  @Input() total: number = 0;
  @Input() hasResultsDropdown: boolean = false;
  @Input() searchData: UsersFilterOptions = { searchText: '', currentPage: 1 };
  @Input() activeLegalRequestFilter: string = '';
  @Input() resultCountMessage: string = '';
  @Input() searchByText = SearchByTextEnum.UsersSearch;

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<UsersFilterOptions>();
  @Output() resetTable = new EventEmitter();

  readonly searchText = signal<string>('');
  readonly filterHasValue = signal<boolean>(true);
  readonly filterAdvanceHasValue = signal<boolean>(false);

  infrastructureSearchForm: FormGroup = this.usersSearchFormService.form;

  ngOnInit(): void {}

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
