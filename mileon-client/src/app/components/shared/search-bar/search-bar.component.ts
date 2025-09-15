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
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  effect,
  DestroyRef,
} from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { SearchFormService } from './search-form.service';
import { fromEvent } from 'rxjs';
import { Keys } from '../../../types/enum/keyboardEnum';
import { AdvancedForm } from '../../../types/advanced-search/form-tab.model';
import { MyRef } from '../../../types/myRef';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../shared/material-module';
import { InputSizeEnum } from '../../../types/enum/inputSizeEnum';
import { DropdownWindowComponent } from "../dropdown-window/dropdown-window.component";
import { AdvancedSearchComponent } from "../advanced-search/advanced-search.component";
import { ResultsDropdownComponent } from "../results-dropdown/results-dropdown.component";
import { HebrewDateService } from '../../../services/hebrew-date.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...MaterialModule, DropdownWindowComponent, AdvancedSearchComponent, ResultsDropdownComponent],
  providers: [
    SearchFormService,
    ...HebrewDateService.getProviders()
  ],
})
export class SearchBarComponent
  extends BaseFormComponent
  implements OnInit, AfterViewInit
{
  private readonly _searchTitle = signal<string>('');
  private readonly _searchBy = signal<string>('');
  private readonly _isSearchMode = signal<boolean>(true);
  private readonly _advancedSearch = signal<AdvancedForm | null>(null);
  private readonly _showPlaceholder = signal<boolean>(false);
  private readonly _resultCountMessage = signal<string>('תוצאות חיפוש');
  private readonly _timeForDebounce = signal<number>(750);
  private readonly _submitOnKey = signal<boolean>(false);
  private readonly _hasResultsDropdown = signal<boolean>(false);
  private readonly _showDatePicker = signal<boolean>(true);
  private readonly _total = signal<number>(0);
  private readonly _showFilters = signal<boolean>(true);
  private readonly _size = signal<InputSizeEnum>(InputSizeEnum.Base);
  private readonly _disabled = signal<boolean>(false);
  private readonly _searchTextValue = signal<string>('');
  private readonly _resultData = signal<any[]>([]);
  private readonly _loader = signal<boolean>(true);
  private readonly _advancedSearchOpened = signal<boolean>(false);
  private readonly _dropdownWindowOpened = signal<boolean>(false);

  get searchTitle(): string {
    return this._searchTitle();
  }

  get searchBy(): string {
    return this._searchBy();
  }

  get isSearchMode(): boolean {
    return this._isSearchMode();
  }

  get advancedSearch(): AdvancedForm | null {
    return this._advancedSearch();
  }

  get showPlaceholder(): boolean {
    return this._showPlaceholder();
  }

  get resultCountMessage(): string {
    return this._resultCountMessage();
  }

  get timeForDebounce(): number {
    return this._timeForDebounce();
  }

  get submitOnKey(): boolean {
    return this._submitOnKey();
  }

  get hasResultsDropdown(): boolean {
    return this._hasResultsDropdown();
  }

  get showDatePicker(): boolean {
    return this._showDatePicker();
  }

  get total(): number {
    return this._total();
  }

  get showFilters(): boolean {
    return this._showFilters();
  }

  get size(): InputSizeEnum {
    return this._size();
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get searchTextValue(): string {
    return this._searchTextValue();
  }

  get resultData(): any[] {
    return this._resultData();
  }

  get loader(): boolean {
    return this._loader();
  }

  get advancedSearchOpened(): boolean {
    return this._advancedSearchOpened();
  }

  get dropdownWindowOpened(): boolean {
    return this._dropdownWindowOpened();
  }

  readonly sizeClass = computed(() => {
    switch (this._size()) {
      case InputSizeEnum.Sm:
        return 'search-bar-sm';
      case InputSizeEnum.Md:
        return 'search-bar-md';
      case InputSizeEnum.Base:
        return 'search-bar-base';
      case InputSizeEnum.Lg:
        return 'search-bar-lg';
      case InputSizeEnum.Xl:
        return 'search-bar-xl';
      default:
        return 'search-bar-base';
    }
  });

  readonly searchBarWidth = computed(() => {
    switch (this._size()) {
      case InputSizeEnum.Sm:
        return '500px';
      case InputSizeEnum.Md:
        return '800px';
      case InputSizeEnum.Base:
        return '100%';
      case InputSizeEnum.Lg:
        return '1100px';
      case InputSizeEnum.Xl:
        return '100%';
      default:
        return '100%';
    }
  });

  readonly InputSizeEnum = InputSizeEnum;
  readonly icons = ConstPath;

  @ViewChild('searchText', { static: true }) textInput!: ElementRef;

  @Output() search = new EventEmitter<any>();
  @Output() executeAction = new EventEmitter<any>();
  @Output() optionSelected = new EventEmitter<any>();
  @Output() resetTable = new EventEmitter<void>();

  @Input()
  set searchTitle(value: string) {
    this._searchTitle.set(value);
  }

  @Input()
  set searchBy(value: string) {
    this._searchBy.set(value);
  }

  @Input()
  form!: FormGroup;

  @Input()
  set isSearchMode(value: boolean) {
    this._isSearchMode.set(value);
  }

  @Input()
  set advancedSearch(value: AdvancedForm) {
    this._advancedSearch.set(value);
  }

  @Input()
  set showPlaceholder(value: boolean) {
    this._showPlaceholder.set(value);
  }

  @Input()
  set resultCountMessage(value: string) {
    this._resultCountMessage.set(value);
  }

  @Input()
  set timeForDebounce(value: number) {
    this._timeForDebounce.set(value);
  }

  @Input()
  set submitOnKey(value: boolean) {
    this._submitOnKey.set(value);
  }

  @Input()
  set hasResultsDropdown(value: boolean) {
    this._hasResultsDropdown.set(value);
  }

  @Input()
  set showDatePicker(value: boolean) {
    this._showDatePicker.set(value);
  }

  @Input()
  set total(value: number) {
    this._total.set(value);
  }

  @Input()
  set showFilters(value: boolean) {
    this._showFilters.set(value);
  }
  
  @Input()
  set size(value: InputSizeEnum) {
    this._size.set(value);
  }
  
  @Input()
  set disabled(value: boolean) {
    this._disabled.set(value);
  }

  @Input()
  set searchTextValue(value: string) {
    this._searchTextValue.set(value);
    if (value) {
      // NOTE ugly due to lack of dev time
      setTimeout(() => {
        this.textInput.nativeElement.value = value;
      });
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
      this._advancedSearchOpened.set(false);
    } else {
      this.closeDropdownWindow();
    }
    this._resultData.set(value);
  }

  @Output()
  searchButtonClicked: MyRef<boolean> = { current: false };

  picker: any;
  startAt = new Date();

  private readonly searchFormService = inject(SearchFormService);
  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for keyboard events and form control changes
  private readonly _keyboardEvent = signal<KeyboardEvent | null>(null);
  private readonly _formControlValue = signal<string | null>(null);

  constructor() {
    super();
    
    // Effect to handle keyboard events
    effect(() => {
      const keyboardEvent = this._keyboardEvent();
      if (keyboardEvent) {
        if (keyboardEvent.key === Keys.SPACE || keyboardEvent.key === Keys.ENTER) {
          if (this.submitOnKey) this.onSearch();
          if (this.hasResultsDropdown) this.triggerAction();
        }
      }
    });

    // Effect to handle form control changes
    effect(() => {
      const formValue = this._formControlValue();
      if (formValue !== null) {
        if (formValue) this.onSearch();
        else this.closeDropdownWindow();
      }
    });
  }

  ngOnInit(): void {
    this.searchFormService.clearForm();
  }

  ngAfterViewInit(): void {
    this.init();
  }

  init() {
    // Set up keyboard event listener using signals
    fromEvent<KeyboardEvent>(this.textInput.nativeElement, 'keyup')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((e: KeyboardEvent) => {
        this._keyboardEvent.set(e);
      });

    // Set up form control changes using signals
    if (this.hasResultsDropdown) {
      let searchControl = this.form.get('searchText');
      if (searchControl) {
        this.formChangeWithDebounce(
          searchControl,
          this.timeForDebounce
        )
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => {
          this._formControlValue.set(value);
        });
      }
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
    this._loader.set(true);
    const searchTextValue = this.form.get('searchText')?.value;
    this._searchTextValue.set(searchTextValue);
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
      this._advancedSearchOpened.set(false);
    }
    if (searchTextValue !== '') {
      this._resultCountMessage.set('תוצאות חיפוש עבור');
    }
    this._loader.set(false);
  }

  // NOTE It's ugly due to lack of time - needs refactor:

  openAdvancedSearch() {
    this.toggleDropdownWindow();
    this._advancedSearchOpened.set(this.dropdownWindowOpened);
  }

  toggleDropdownWindow() {
    this._dropdownWindowOpened.set(!this.dropdownWindowOpened);
  }

  closeDropdownWindow() {
    this._dropdownWindowOpened.set(false);
  }

  openDropdownWindow() {
    this._dropdownWindowOpened.set(true);
  }

  triggerAction() {
    // NOTE ugly due to lack of dev time, supposed to be dynamic
    this.closeDropdownWindow();
    this.executeAction.emit(this.form);
  }

  onOptionSelected(item: any) {
    this.closeDropdownWindow();
    this.optionSelected.emit(item);
  }

  onDatePickerToggle() {
    // Close the advanced search window if it's open when date picker is toggled
    if (this.advancedSearchOpened) {
      this._advancedSearchOpened.set(false);
      this.closeDropdownWindow();
    }
  }
}
