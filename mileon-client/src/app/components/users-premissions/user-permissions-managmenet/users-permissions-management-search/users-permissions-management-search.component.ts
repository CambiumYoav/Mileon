import { Component, Input, OnInit, Output, EventEmitter, signal, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../../services/base.service';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { UsersSearchFormService } from '../../users/users-search/users-search-form.service';
import { SearchByTextEnum } from '../../../../types/enum/searchByTextEnum';
import { SearchBarComponent } from "../../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-users-permissions-management-search',
  templateUrl: './users-permissions-management-search.component.html',
  styleUrls: ['./users-permissions-management-search.component.scss'],
  standalone: true,
  imports: [SearchBarComponent],
})
export class UsersPermissionsManagementSearchComponent implements OnInit {
  SearchByTextEnum = SearchByTextEnum;

  @Input() resultData: any[] = [];
  @Input() total: number = 0;
  @Input() hasResultsDropdown: boolean = false;
  @Input() searchData: UsersFilterOptions = new UsersFilterOptions();
  @Input() activeLegalRequestFilter: string = '';
  @Input() resultCountMessage: string = '';
  @Input() searchByText: SearchByTextEnum = SearchByTextEnum.AreaSearch;
  
  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<FormGroup>();
  @Output() resetTable = new EventEmitter();

  infrastructureSearchForm: FormGroup;
  searchText = signal<string>('');
  filterHasValue = signal<boolean>(true);
  filterAdvanceHasValue = signal<boolean>(false);

  constructor(
    private usersSearchFormService: UsersSearchFormService,
    private _baseService: BaseService
  ) {
    this.infrastructureSearchForm = this.usersSearchFormService.form;
  }

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
