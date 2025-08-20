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
import { DropdownWindowComponent } from "../dropdown-window/dropdown-window.component";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  imports: [SharedImports, DropdownWindowComponent, AdvancedSearchComponent],
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
  

  private _resultData: any[] = [];
  picker: any;


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
    this.searchFormService.clearForm();
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
    // Emit search so parent resets the table
    this.onSearch();
  }

  onSearch() {
    this.loader = true;
    this._searchTextValue = this.form.get('searchText')?.value;
    // for (let name of Object.keys(this.form.controls)) {
    //   const formGroup = this.form.controls[name] as FormGroup;
    //   if (this.checkIfExistsAndValid(formGroup.controls))
    //     this.concatFormControls(this.searchForm, this.form.controls, name);
    // }
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
