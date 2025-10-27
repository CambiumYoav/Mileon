import { Component, EventEmitter, Input, Output, OnInit, inject, ChangeDetectionStrategy, signal, computed, input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../services/base.service';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { UsersFilterOptions } from '../../../types/users/usersFilterOptions';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { TerminalSearchService } from '../../terminal/terminal-search/terminal-search.service';
import { AuthorityManagementSearchService } from './authority-management-search.service';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-search',
  templateUrl: './authority-management-search.component.html',
  styleUrls: ['./authority-management-search.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    SearchBarComponent,
  ],
})
export class AuthorityManagementSearchComponent implements OnInit {
  readonly SearchByTextEnum = SearchByTextEnum;
  readonly resultData = input<any[]>([]);
  readonly total = input<number>(0);
  readonly hasResultsDropdown = input<boolean>(false);
  readonly searchData = input<UsersFilterOptions | null>(null);
  readonly activeLegalRequestFilter = input<string>('');
  readonly resultCountMessage = input<string>('');
  readonly searchByText = input<SearchByTextEnum>(SearchByTextEnum.TemplatesSearch);

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<UsersFilterOptions>();
  @Output() resetTable = new EventEmitter();

  private readonly _infrastructureSearchForm = signal<FormGroup | null>(null);
  private readonly _searchText = signal<string>('');
  private readonly _filterHasValue = signal<boolean>(true);
  private readonly _filterAdvanceHasValue = signal<boolean>(false);

  readonly infrastructureSearchForm = computed(() => this._infrastructureSearchForm()!);
  readonly searchText = computed(() => this._searchText());
  readonly filterHasValue = computed(() => this._filterHasValue());
  readonly filterAdvanceHasValue = computed(() => this._filterAdvanceHasValue());

  private readonly searchFormService = inject(SearchFormService);
  private readonly authorityManagementSearchService = inject(AuthorityManagementSearchService);
  private readonly baseService = inject(BaseService);

  constructor() {
    this._infrastructureSearchForm.set(this.authorityManagementSearchService.form);
  }

  ngOnInit(): void {}

  async sendFormValue(searchForm: FormGroup) {
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
