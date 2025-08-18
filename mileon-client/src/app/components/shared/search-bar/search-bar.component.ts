import { BaseFormComponent } from './../base-form/base-form.component';
import { FormGroup, FormControl } from '@angular/forms';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  AfterViewInit,
  ElementRef,
  ViewChild,
  HostListener,
} from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { SearchFormService } from './search-form.service';
import { fromEvent } from 'rxjs';
import { Keys } from '../../../types/enum/keyboardEnum';
import { AdvancedForm } from '../../../types/advanced-search/form-tab.model';
import { MyRef } from '../../../types/myRef';
import { SharedImports } from '../../../shared/shared-modules';
import { InputSizeEnum } from '../../../types/enum/inputSizeEnum';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [SharedImports],
  providers: [SearchFormService],
})
export class SearchBarComponent
  extends BaseFormComponent
  implements OnInit, AfterViewInit
{
  InputSizeEnum = InputSizeEnum;
  icons = ConstPath;

  // searchForm: FormGroup = this.searchFormService.form;

  @ViewChild('searchText', { static: true }) textInput!: ElementRef;

  @Output() search = new EventEmitter<any>();

  @Output() executeAction = new EventEmitter<any>();

  @Input()
  searchTitle!: string;  

  @Input()
  searchBy!: string;

  @Input()
  form!: FormGroup;

  @Input()
  isSearchMode: boolean = true;

  @Input()
  advancedSearch!: AdvancedForm;

  @Input()
  showPlaceholder: boolean = false;

  @Input()
  resultCountMessage: string = 'תוצאות חיפוש';

  @Input()
  timeForDebounce: number = 750;

  @Input()
  submitOnKey: boolean = false;

  @Input()
  hasResultsDropdown: boolean = false;

  @Input()
  showDatePicker: boolean = true;

  @Input()
  total: number = 0;

  @Output()
  searchButtonClicked: MyRef<boolean> = { current: false };

  @Input() showFilters: boolean = true;
  
  @Input() size: InputSizeEnum = InputSizeEnum.Base;
  
  @Input() disabled: boolean = false;
  
  @Input() set suggestions(value: string[]) {
    this._suggestions = value;
    this.allSuggestions = [...value];
  }
  
  get suggestions(): string[] {
    return this._suggestions;
  }
  
  private _suggestions: string[] = [];
  private _resultData: any[] = [];
  picker: any;

  private filterSuggestions(value: string): void {
    if (!value || value.trim() === '') {
      this.showSuggestions = false;
      this.filteredSuggestions = [];
      return;
    }

    const searchTerm = value.toLowerCase().trim();
    this.filteredSuggestions = this.allSuggestions.filter(suggestion =>
      suggestion.toLowerCase().includes(searchTerm)
    );
    
    this.showSuggestions = this.filteredSuggestions.length > 0;
  }

  selectSuggestion(suggestion: string): void {
    const searchControl = this.form.get('searchText');
    if (searchControl) {
      searchControl.setValue(suggestion);
    }
    this.showSuggestions = false;
    this.onSearch();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.showSuggestions = false;
    }
  }

  @Input()
  set resultData(value: any[]) {
    // Update childProperty and perform other actions if needed
    if (
      value?.length &&
      this.form.get('searchText')?.value &&
      this.hasResultsDropdown
    ) {
      this.openDropdownWindow();
      this.advancedSearchOpened = false;
    } else {
      this.closeDropdownWindow();
    }
    this._resultData = value;
  }

  get resultData(): any[] {
    return this._resultData;
  }

  get sizeClass(): string {
    return `search-bar-${this.size}`;
  }

  _searchTextValue: string = '';
  
  // Suggestions properties
  showSuggestions: boolean = false;
  filteredSuggestions: string[] = [];
  allSuggestions: string[] = [];

  get searchTextValue(): string {
    return this._searchTextValue;
  }

  @Input() set searchTextValue(value: string) {
    this._searchTextValue = value;
    if (value) {
      // NOTE ugly due to lack of dev time
      setTimeout(() => {
        this.textInput.nativeElement.value = value;
      });
    }
  }

  @Output() resetTable = new EventEmitter<void>();

  loader: boolean = true;

  advancedSearchOpened: boolean = false;

  dropdownWindowOpened: boolean = false;

  constructor(
    private searchFormService: SearchFormService,
    private elementRef: ElementRef
  ) {
    super();
  }

  ngOnInit(): void {
    console.log('Search bar component initialized');
    console.log('Form received:', this.form);
    // Don't clear the parent form, just ensure searchText control exists
    if (this.form && !this.form.get('searchText')) {
      console.log('Adding searchText control to form');
      this.form.addControl('searchText', new FormControl(''));
    }
    console.log('Form controls after init:', Object.keys(this.form?.controls || {}));
    
    // Subscribe to search text changes to show/hide suggestions
    const searchControl = this.form.get('searchText');
    if (searchControl) {
      searchControl.valueChanges.subscribe(value => {
        this.filterSuggestions(value);
      });
    }
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    fromEvent<KeyboardEvent>(this.textInput.nativeElement, 'keyup').subscribe(
      (e: KeyboardEvent) => {
        if (e.key === Keys.SPACE || e.key === Keys.ENTER) {
          if (this.submitOnKey) this.onSearch();
          if (this.hasResultsDropdown) this.triggerAction();
          return;
        }
      }
    );
    if (this.hasResultsDropdown) {
      let searchControl = this.form.get('searchText');
      if (searchControl)
        this.formChangeWithDebounce(
          searchControl,
          this.timeForDebounce
        ).subscribe((value) => {
          if (value) this.onSearch();
          else this.closeDropdownWindow();
        });
    }
  }

  resetSearch(): void {
    const searchControl = this.form.get('searchText');
    if (searchControl) {
      searchControl.setValue('');
    }
    this.closeDropdownWindow();
    this.showSuggestions = false;
    // Emit search so parent resets the table
    this.onSearch();
  }

  onSearch() {
    console.log('Search triggered in search bar component');
    this.loader = true;
    const searchControl = this.form.get('searchText');
    this._searchTextValue = searchControl?.value || '';
    console.log('Search text value:', this._searchTextValue);
    console.log('Form being emitted:', this.form);
    
    this.search.emit(this.form);
    if (this.searchButtonClicked.current) {
      this.triggerAction();
    }
    if (!this.submitOnKey) {
      if (this.resultData?.length) this.openDropdownWindow();
      else this.closeDropdownWindow();
    } else {
      this.advancedSearchOpened = false;
    }
    if (this._searchTextValue !== '') {
      this.resultCountMessage = 'תוצאות חיפוש עבור';
    }
    this.loader = false;
  }

  // NOTE It's ugly due to lack of time - needs refactor:

  openAdvancedSearch() {
    this.toggleDropdownWindow();
    this.advancedSearchOpened = this.dropdownWindowOpened;
  }

  toggleDropdownWindow() {
    this.dropdownWindowOpened = !this.dropdownWindowOpened;
  }

  closeDropdownWindow() {
    this.dropdownWindowOpened = false;
  }

  openDropdownWindow() {
    this.dropdownWindowOpened = true;
  }

  triggerAction() {
    // NOTE ugly due to lack of dev time, supposed to be dynamic
    this.closeDropdownWindow();
    this.executeAction.emit(this.form);
  }
}
