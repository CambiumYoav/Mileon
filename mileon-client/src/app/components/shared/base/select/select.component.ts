import { SelectService } from './select.service';
import {
  DataFunction,
  ExtraParam,
} from '../../../../types/advanced-search/form-tab.model';
import {
  Component,
  forwardRef,
  OnInit,
  Input,
  SimpleChanges,
  EventEmitter,
  Injector,
  Output,
  OnChanges,
  ChangeDetectionStrategy,
  signal,
  computed,
  HostListener,
  ElementRef,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../abstract/form-control-value-accessor-connector.component';
import { of } from 'rxjs/internal/observable/of';
import {
  Observable,
  BehaviorSubject,
  takeUntil,
  debounceTime,
  take,
} from 'rxjs';
import { SelectParams } from '../../../../types/advanced-search/select-option.model';
import { ConstPath } from '../../../../constants/const_path';
import { SharedImports } from '../../../../shared/shared-modules';
import { MaterialModule } from '../../../../shared/material-module';
import { CommonModule } from '@angular/common';
import { InfiniteScrollDirective } from '../../../../directives/infinite-scroll.directive';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    InfiniteScrollDirective,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent
  extends FormControlValueAccessorConnector
  implements OnInit, OnChanges
{
  Icons = ConstPath;
  @Input() appearance: 'legacy' | 'standard' | 'fill' | 'outline' = 'legacy';
  @Input() listObj$: Observable<any> = of({});
  @Input() items$: Observable<Array<any>> = of([]);
  @Input() dataFunction: DataFunction | undefined;
  @Input() override title: string = '';
  @Input() override placeholder: string = '';

  @Input() bindValueKey: string = 'id';
  @Input() bindLabelKey: string = 'value';
  @Input() bindLabelKeys: string[] | undefined;
  @Input() searchPlaceholder: string = '';
  @Output() itemFilterServerSide = new EventEmitter<string>();
  @Input() isMultiSelect!: boolean;
  @Input() ids: string[] | number[] = [];
  @Input() isValid: boolean | undefined = true;
  @Input() connectedFiledValue: any;
  @Input() displaySearch: boolean = true;
  @Input() isRequired: boolean | undefined = false;
  @Input() disabled: boolean = false;
  @Input() options: any[] = []; // Add support for static options

  private readonly _endOfData = signal(false);
  private readonly _isSearchVisible = signal(false);
  private readonly _isLoading = signal(false);

  readonly endOfData = this._endOfData.asReadonly();
  readonly isSearchVisible = this._isSearchVisible.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  filterFormControl: FormControl = new FormControl('');

  extraParams: BehaviorSubject<any> = new BehaviorSubject<any>('');

  selectParams: SelectParams & { [key: string]: any } = {
    pageSize: 10,
    currentPage: 1,
    ids: [],
  };

  private isServerSide: boolean = true;
  private currentStaticItems: Array<any> = [];

  constructor(
    injector: Injector,
    private selectService: SelectService,
    private eRef: ElementRef
  ) {
    super(injector);
  }

  private listenToFilterFormControlChanges(): void {
    this.formChangeWithDebounce(this.filterFormControl, 300).subscribe(
      (value: string) => {
        if (this.isServerSide) {
          this.setDataListParams(value);
        } else {
          this.filterStaticList(value);
        }
      }
    );
  }

  private filterStaticList(value: string) {
    const currentItems =
      this.options && this.options.length > 0
        ? this.options
        : this.currentStaticItems;
    const filterValue = this._normalizeValue(value);
    this.items$ = of(
      currentItems.filter((item) =>
        this._normalizeValue(item).includes(filterValue)
      )
    );
  }

  private _normalizeValue(value: any): string {
    if (typeof value != 'string') {
      // Handle null/undefined values
      if (value === null || value === undefined) {
        return '';
      }
      // Try different possible label properties
      const labelValue =
        value[this.bindLabelKey] ||
        value.display ||
        value.label ||
        value.name ||
        value.value ||
        '';
      value = labelValue;
    }
    return (value || '').toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    // Ensure there is always a control instance to bind to
    const parentControl =
      this.formControl ||
      this.controlContainer.control?.get(this.formControlName);
    if (!parentControl) {
      this.formControl = new FormControl('');
    }

    // Initialize listObj$ after constructor
    this.listObj$ = this.selectService.listsObj.asObservable();

    // Ensure multi-select controls always have array values
    if (this.isMultiSelect && this.control) {
      if (!this.control.value || !Array.isArray(this.control.value)) {
        this.control.setValue([]);
      }
    }

    if (this.control.value) {
      if (this.isMultiSelect) {
        // For multi-select, ensure we have full objects, not just IDs
        // Check if the value is an array before calling map
        if (Array.isArray(this.control.value)) {
          this.selectParams.ids = this.control.value.map((item: any) =>
            typeof item === 'object' && item !== null
              ? item[this.bindValueKey || 'id']
              : item
          );
        } else {
          // If it's not an array but multi-select is enabled, wrap it in an array
          const value = this.control.value;
          this.selectParams.ids = [
            typeof value === 'object' && value !== null
              ? value[this.bindValueKey || 'id']
              : value,
          ];
        }
      } else {
        const value = this.control.value;
        this.selectParams.ids = [
          typeof value === 'object' && value !== null
            ? value[this.bindValueKey || 'id']
            : value,
        ];
      }
    }
    this.setConnectedFieldValue();
    this.setDataListParams();
    this.listenToFilterFormControlChanges();

    // Handle static options if provided
    if (this.options && this.options.length > 0) {
      this.items$ = of(this.options);
      this.isServerSide = false;
      this.currentStaticItems = this.options;
      // Convert existing control values to objects
      setTimeout(() => {
        this.convertControlValuesToObjects();
      }, 0);
    }
    // Handle dataFunction directly if it's a static function
    else if (this.dataFunction && this.dataFunction.function) {
      try {
        const staticData = this.dataFunction.function();
        if (Array.isArray(staticData)) {
          this.items$ = of(staticData);
          this.isServerSide = false;
          this.currentStaticItems = staticData;
          // Convert existing control values to objects
          setTimeout(() => {
            this.convertControlValuesToObjects();
          }, 0);
        }
      } catch (error) {
        console.warn('Error executing dataFunction:', error);
      }
    }

    this.listObj$.pipe(takeUntil(this.componentDestroyed$)).subscribe((res) => {
      // Don't override static options if they are provided
      if (this.options && this.options.length > 0) {
        return;
      }

      // Don't override static dataFunction results if they are provided
      if (
        this.dataFunction &&
        this.dataFunction.function &&
        !this.isServerSide
      ) {
        return;
      }

      if (this.dataFunction && this.dataFunction.name !== undefined) {
        if (
          res[this.dataFunction.name as keyof typeof res] &&
          res[this.dataFunction.name as keyof typeof res][
            this.formControlName
          ] &&
          res[this.dataFunction.name as keyof typeof res][this.formControlName]
            ?.length
        ) {
          this.items$ = of(
            res[this.dataFunction.name as keyof typeof res][
              this.formControlName
            ] as any[]
          );
        }
      } else {
        this.items$ = of(
          (res[this.formControlName as keyof typeof res] as any[]) || []
        );
      }

      // Convert existing control values from IDs to full objects for multi-select
      // Use setTimeout to ensure items$ has been updated
      setTimeout(() => {
        this.convertControlValuesToObjects();
      }, 0);
    });

    // Respect disabled input using ControlValueAccessor API to avoid template binding warnings
    if (this.disabled) {
      this.setDisabledState(true);
    }
  }

  updateCurrentPage() {
    if (this._endOfData()) {
      return;
    }
    this.selectParams.currentPage++;
    this.setDataListParams();
  }

  setDataListParams(term?: string) {
    if (this.dataFunction) {
      let isControlDisabled = false;
      // const this.selectParams: SelectParams = {};
      if (this.dataFunction.extraParams) {
        for (let param of this.dataFunction.extraParams) {
          const paramControl = this.controlContainer.control!.get(
            param.connectedField
          );
          if (paramControl) {
            this.listenToConnectedFieldForParams(paramControl, param);
            this.setDisabledState(!paramControl.value); // set initial state
            isControlDisabled =
              !paramControl.value && !this.connectedFiledValue;
          }
        }
      }
      if (term != undefined) {
        if (term !== this.selectParams.searchText) {
          this.selectParams.currentPage = 1;
          this.selectParams.searchText = term;
        }
      }

      // If we have static options, don't make server calls
      if (this.options && this.options.length > 0) {
        if (term) {
          this.filterStaticList(term);
        }
        return;
      }

      // If we have a static function, don't make server calls
      if (this.dataFunction.function && !this.isServerSide) {
        if (term) {
          this.filterStaticList(term);
        }
        return;
      }

      if (this.filterFormControl.enabled && !isControlDisabled)
        this.getDataList(this.selectParams);
    }
  }

  listenToConnectedFieldForParams(
    paramControl: AbstractControl,
    param: ExtraParam
  ) {
    this.onValueChanges(paramControl)
      .pipe(debounceTime(250))
      .subscribe((value) => {
        if (value) {
          this.items$ = of([]);
          value = Array.isArray(value) ? value : [value];
          this.selectParams.currentPage = 1;
          this.selectParams[param.paramName] = value;
          this.setDisabledState(!value?.length);
          if (value?.length) {
            this.selectParams.ids = Array.isArray(this.ids)
              ? this.ids
              : [this.ids];
            this.getDataList(this.selectParams);
          }
        } else {
          this.setDisabledState(true);
          if (this.isMultiSelect) {
            this.control.setValue([]);
          } else {
            this.control.setValue(null);
          }
        }
      });
  }

  async getDataList(paramObj: SelectParams) {
    if (this.dataFunction) {
      this._isLoading.set(true);
      try {
        let res = await this.selectService.getDataList(
          this.formControlName,
          this.dataFunction,
          paramObj,
          this.dataFunction.name
        );
        this._endOfData.set(res?.isEndOfData ?? false);
        this.isServerSide = res?.isServerSide ?? false;
        if (!this.isServerSide) {
          this.items$.pipe(take(1)).subscribe((data) => {
            this.currentStaticItems = data;
          });
        }
      } finally {
        this._isLoading.set(false);
      }
    }
  }

  clearSelectionAndUpdateDateAccordingly(): void {
    if (this.isMultiSelect) {
      this.control.setValue([]);
    } else {
      this.control.setValue(null);
    }

    this.selectParams.ids = [];
    this.selectParams.currentPage = 1;
    this.setConnectedFieldValue();
    this.items$ = of([]);
    this.getDataList(this.selectParams);
  }

  setConnectedFieldValue() {
    if (this.dataFunction) {
      if (this.dataFunction.extraParams) {
        for (let param of this.dataFunction.extraParams) {
          const paramControl = this.controlContainer.control!.get(
            param.connectedField
          );
          if (param && paramControl?.value) {
            this.selectParams[param.paramName] = paramControl.value;
          } else if (this.connectedFiledValue) {
            let value = Array.isArray(this.connectedFiledValue)
              ? this.connectedFiledValue
              : [this.connectedFiledValue];
            this.selectParams[param.paramName] = value;
          }
        }
      }
    }
  }

  constructLabel(item: any, keys: string[] | undefined): string {
    if (keys) {
      return keys.map((key) => item[key]).join(' - ');
    }
    return '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.items$ instanceof Array) {
      this.currentStaticItems = this.items$;
      this.items$ = of(this.items$);
      this.isServerSide = false;
    }

    // Handle static options changes
    if (changes['options'] && this.options && this.options.length > 0) {
      this.items$ = of(this.options);
      this.isServerSide = false;
      this.currentStaticItems = this.options;
      // Convert existing control values to objects
      setTimeout(() => {
        this.convertControlValuesToObjects();
      }, 0);
    }

    if (changes['ids']) {
      this.items$ = of([]);
      this._endOfData.set(false);
      this.selectParams.ids = Array.isArray(this.ids) ? this.ids : [this.ids];
      // if this is a field that is connected to another field we don't want to
      // send a request to server because the function listen to connected fields make it.
      if (this.dataFunction && this.dataFunction['extraParams']) {
        return;
      }
      if (this.selectParams.ids) {
        this.selectParams.currentPage = 1;
        this.getDataList(this.selectParams);
      }
    }

    // Apply disabled state changes programmatically
    if (changes['disabled']) {
      this.setDisabledState(!!this.disabled);
    }
  }

  compareValues(option1: any, option2: any): boolean {
    // Ensure we have a valid bindValueKey
    const bindValueKey = this.bindValueKey || 'id';

    // Handle null/undefined cases first
    if (option1 === null && option2 === null) return true;
    if (option1 === undefined && option2 === undefined) return true;
    if (
      option1 === null ||
      option1 === undefined ||
      option2 === null ||
      option2 === undefined
    )
      return false;

    // Both are objects - compare by bindValueKey
    if (
      typeof option1 === 'object' &&
      option1 !== null &&
      typeof option2 === 'object' &&
      option2 !== null
    ) {
      return option1[bindValueKey] === option2[bindValueKey];
    }

    // One is object, one is primitive - extract value from object and compare
    if (typeof option1 === 'object' && option1 !== null) {
      return option1[bindValueKey] === option2;
    }

    if (typeof option2 === 'object' && option2 !== null) {
      return option1 === option2[bindValueKey];
    }

    // Both are primitives - direct comparison
    return option1 === option2;
  }

  getSelectedItemLabel(selectedValue: any): string {
    // For multi-select, we now store full item objects, so this is much simpler
    if (typeof selectedValue === 'object' && selectedValue !== null) {
      if (this.bindLabelKeys) {
        return this.constructLabel(selectedValue, this.bindLabelKeys);
      } else {
        // Try different possible label properties
        return (
          selectedValue[this.bindLabelKey] ||
          selectedValue.display ||
          selectedValue.label ||
          selectedValue.name ||
          selectedValue.value ||
          'Unknown'
        );
      }
    }

    // Fallback for single select or edge cases
    return selectedValue?.toString() || 'Unknown';
  }

  removeSelectedItem(index: number, event: Event): void {
    // Prevent the event from bubbling up and closing the select
    event.stopPropagation();
    event.preventDefault();

    if (this.isMultiSelect && this.control.value) {
      // Ensure the control value is an array before spreading
      const controlValue = Array.isArray(this.control.value)
        ? this.control.value
        : [this.control.value];
      const currentValue = [...controlValue];
      currentValue.splice(index, 1);
      this.control.setValue(currentValue);

      // Update the selectParams.ids if needed - extract IDs from full objects
      if (this.selectParams.ids && this.selectParams.ids.length > 0) {
        const bindValueKey = this.bindValueKey || 'id';
        this.selectParams.ids = currentValue.map((item: any) =>
          typeof item === 'object' && item !== null ? item[bindValueKey] : item
        );
      }

      // If we have static options, update the currentStaticItems
      if (this.options && this.options.length > 0) {
        this.currentStaticItems = this.options;
      }
    }
  }

  onSelectOpened(isOpened: boolean): void {
    if (isOpened && this.displaySearch) {
      this._isSearchVisible.set(true);
      // Clear any previous search
      this.filterFormControl.setValue('');
      // Focus the search input after a short delay to ensure it's rendered
      setTimeout(() => {
        const searchInput = document.querySelector(
          '.search-input-overlay'
        ) as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      // Hide search and reset filter when select closes
      this._isSearchVisible.set(false);
      this.filterFormControl.setValue('');
      // Reset the items list to show all items when search is cleared
      if (!this.isServerSide && this.currentStaticItems.length > 0) {
        this.items$ = of(this.currentStaticItems);
      } else if (this.options && this.options.length > 0) {
        this.items$ = of(this.options);
      }
    }
  }

  onSearchFocus(): void {
    // Keep search visible when focused
    this._isSearchVisible.set(true);
  }

  onSearchBlur(): void {
    // Hide search when blurred and return to normal select mode
    setTimeout(() => {
      this._isSearchVisible.set(false);
      // Clear search filter when hiding search
      this.filterFormControl.setValue('');
    }, 150);
  }

  hideSearch(): void {
    this._isSearchVisible.set(false);
    this.filterFormControl.setValue('');
    // Reset the items list to show all items when search is cleared
    if (!this.isServerSide && this.currentStaticItems.length > 0) {
      this.items$ = of(this.currentStaticItems);
    } else if (this.options && this.options.length > 0) {
      this.items$ = of(this.options);
    }
    // Focus back to the select
    const selectElement = document.querySelector(
      '.mat-mdc-select-trigger'
    ) as HTMLElement;
    if (selectElement) {
      selectElement.focus();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    // Only handle click outside if search is visible and displaySearch is enabled
    if (
      this.displaySearch &&
      this.isSearchVisible() &&
      !this.eRef.nativeElement.contains(event.target as Node)
    ) {
      // Check if click is not on the mat-select panel
      const target = event.target as Element;
      const isClickOnSelectPanel = target.closest('.mat-mdc-select-panel');

      if (!isClickOnSelectPanel) {
        this._isSearchVisible.set(false);
        this.filterFormControl.setValue('');
        // Reset the items list to show all items when search is cleared
        if (!this.isServerSide && this.currentStaticItems.length > 0) {
          this.items$ = of(this.currentStaticItems);
        } else if (this.options && this.options.length > 0) {
          this.items$ = of(this.options);
        }
      }
    }
  }

  /**
   * TrackBy function for better performance with @for loops
   * Uses item.id if available, otherwise falls back to index
   */
  trackByItemId(index: number, item: any): any {
    const bindValueKey = this.bindValueKey || 'id';
    // Prefer a stable identifier, but append index to avoid NG0955 on duplicate keys
    const stableId = item?.[bindValueKey] ?? item?.id ?? item?.value;
    return stableId !== undefined && stableId !== null
      ? `${stableId}__${index}`
      : index;
  }

  /**
   * Override writeValue to ensure multi-select always gets an array
   */
  override writeValue(value: any): void {
    // For multi-select, ensure the value is always an array
    if (this.isMultiSelect) {
      if (value === null || value === undefined) {
        value = [];
      } else if (!Array.isArray(value)) {
        value = [value];
      }
    }
    super.writeValue(value);
  }

  /**
   * Helper method to check if control value is an array (for template usage)
   */
  isControlValueArray(): boolean {
    return Array.isArray(this.control?.value);
  }

  /**
   * TrackBy function for selected items in multi-select
   * Uses item.id or bindValueKey if available, otherwise falls back to a unique combination
   */
  trackBySelectedItem(index: number, item: any): any {
    if (typeof item === 'object' && item !== null) {
      // Try to get a unique identifier from the object
      const bindValueKey = this.bindValueKey || 'id';
      const bindLabelKey = this.bindLabelKey || 'value';
      const id = item[bindValueKey] ?? item.id ?? item.value;
      if (id !== undefined && id !== null) {
        return id;
      }
      // If no unique id found, create one from multiple properties
      const label =
        item[bindLabelKey] ?? item.display ?? item.label ?? item.name;
      return `${index}_${JSON.stringify(item)}_${label}`;
    }
    // For primitive values, combine with index to ensure uniqueness
    return `${index}_${item}`;
  }

  /**
   * Convert existing control values from IDs to full objects for multi-select
   */
  private convertControlValuesToObjects(): void {
    if (!this.isMultiSelect || !this.control.value) {
      return;
    }

    this.items$.pipe(take(1)).subscribe((items) => {
      if (!items || items.length === 0) {
        return;
      }

      const currentValue = this.control.value;
      if (Array.isArray(currentValue)) {
        const convertedValues = currentValue.map((value: any) => {
          // If it's already an object, return as is
          if (typeof value === 'object' && value !== null) {
            return value;
          }

          // If it's a primitive value, find the corresponding object
          const bindValueKey = this.bindValueKey || 'id';
          const foundItem = items.find(
            (item) =>
              item[bindValueKey] === value ||
              item.id === value ||
              item.value === value
          );

          return foundItem || value;
        });

        // Only update if there were changes
        if (JSON.stringify(convertedValues) !== JSON.stringify(currentValue)) {
          this.control.setValue(convertedValues);
        }
      } else {
        // Handle single value case (shouldn't happen in multi-select, but just in case)
        if (typeof currentValue === 'object' && currentValue !== null) {
          return; // Already an object
        }

        const bindValueKey = this.bindValueKey || 'id';
        const foundItem = items.find(
          (item) =>
            item[bindValueKey] === currentValue ||
            item.id === currentValue ||
            item.value === currentValue
        );

        if (foundItem) {
          this.control.setValue(foundItem);
        }
      }
    });
  }
}
