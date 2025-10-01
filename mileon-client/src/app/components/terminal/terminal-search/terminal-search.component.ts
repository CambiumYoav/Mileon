import { Component, EventEmitter, Input, Output, signal, computed, inject, DestroyRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseService } from '../../../services/base.service';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { TerminalSearchService } from './terminal-search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchBarComponent } from "../../shared/search-bar/search-bar.component";

@Component({
  selector: 'app-terminal-search',
  
  templateUrl: './terminal-search.component.html',
  styleUrls: ['./terminal-search.component.scss'],
  imports: [SearchBarComponent]
})
export class TerminalSearchComponent {
  SearchByTextEnum = SearchByTextEnum;
  
  private readonly _resultData = signal<any[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _hasResultsDropdown = signal<boolean>(false);
  private readonly _searchData = signal<FilterOptions | null>(null);
  private readonly _activeLegalRequestFilter = signal<string>('');
  private readonly _resultCountMessage = signal<string>('');
  private readonly _searchByText = signal<SearchByTextEnum>(SearchByTextEnum.TicketBooksSearch);
  private readonly _searchText = signal<string>('');
  private readonly _filterHasValue = signal<boolean>(true);
  private readonly _filterAdvanceHasValue = signal<boolean>(false);

  get resultData(): any[] {
    return this._resultData();
  }

  get total(): number {
    return this._total();
  }

  get hasResultsDropdown(): boolean {
    return this._hasResultsDropdown();
  }

  get searchData(): FilterOptions | null {
    return this._searchData();
  }

  get activeLegalRequestFilter(): string {
    return this._activeLegalRequestFilter();
  }

  get resultCountMessage(): string {
    return this._resultCountMessage();
  }

  get searchByText(): SearchByTextEnum {
    return this._searchByText();
  }

  get searchText(): string {
    return this._searchText();
  }

  get filterHasValue(): boolean {
    return this._filterHasValue();
  }

  get filterAdvanceHasValue(): boolean {
    return this._filterAdvanceHasValue();
  }

  @Input()
  set resultData(value: any[]) {
    this._resultData.set(value);
  }

  @Input()
  set total(value: number) {
    this._total.set(value);
  }

  @Input()
  set hasResultsDropdown(value: boolean) {
    this._hasResultsDropdown.set(value);
  }

  @Input()
  set searchData(value: FilterOptions) {
    this._searchData.set(value);
  }

  @Input()
  set activeLegalRequestFilter(value: string) {
    this._activeLegalRequestFilter.set(value);
  }

  @Input()
  set resultCountMessage(value: string) {
    this._resultCountMessage.set(value);
  }

  @Input()
  set searchByText(value: SearchByTextEnum) {
    this._searchByText.set(value);
  }

  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<FilterOptions>();
  @Output() resetTable = new EventEmitter();

  infrastructureSearchForm!: FormGroup;

  private readonly searchFormService = inject(SearchFormService);
  private readonly terminalSearchFormService = inject(TerminalSearchService);
  private readonly _baseService = inject(BaseService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {}

  ngOnInit(): void {
    this.infrastructureSearchForm = this.terminalSearchFormService.form;
  }

  async sendFormValue(searchForm: FormGroup) {
    this.terminalSearchFormService.searchForm = searchForm;
    const formValue: any = { ...searchForm.value };
    
    // Process form values for time and date handling
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
    
    // Update search text signal
    if (formValue.searchText) {
      this._searchText.set(formValue.searchText);
    }
    
    if (searchForm.valid) {
      this.onSearch.emit(formValue);
    }
  }

}

