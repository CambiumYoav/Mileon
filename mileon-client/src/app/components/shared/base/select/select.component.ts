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
import { Observable, BehaviorSubject, takeUntil, debounceTime } from 'rxjs';
import { SelectParams } from '../../../../types/advanced-search/select-option.model';
import { ConstPath } from '../../../../constants/const_path';
import { SharedImports } from '../../../../shared/shared-modules';
import { MaterialModule } from '../../../../shared/material-module';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  imports: [MaterialModule,FormsModule,CommonModule,ReactiveFormsModule],
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
  @Input() listObj$: Observable<Array<any>> = of([]);
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

  endOfData: boolean = false;
  isSearchVisible: boolean = false;

  filterFormControl: FormControl = new FormControl('');

  extraParams: BehaviorSubject<any> = new BehaviorSubject<any>('');

  selectParams: SelectParams & { [key: string]: any } = {
    pageSize: 10,
    currentPage: 1,
  };

  private isServerSide: boolean = true;
  private currentStaticItems: Array<any> = [];

  constructor(injector: Injector, private selectService: SelectService) {
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
    const currentItems = this.options && this.options.length > 0 ? this.options : this.currentStaticItems;
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
      const labelValue = value[this.bindLabelKey] || value.display || value.label || value.name || value.value || '';
      value = labelValue;
    }
    return (value || '').toLowerCase().replace(/\s/g, '');
  }

  ngOnInit(): void {
    // Initialize listObj$ after constructor
    this.listObj$ = this.selectService.listsObj.asObservable();
    
    if (this.control.value) {
      if (this.isMultiSelect) {
        // For multi-select, ensure we have full objects, not just IDs
        this.selectParams.ids = this.control.value.map((item: any) => 
          (typeof item === 'object' && item !== null) ? item[this.bindValueKey] : item
        );
      } else {
        this.selectParams.ids = [this.control.value];
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
    }
    // Handle dataFunction directly if it's a static function
    else if (this.dataFunction && this.dataFunction.function) {
      try {
        const staticData = this.dataFunction.function();
        if (Array.isArray(staticData)) {
          this.items$ = of(staticData);
          this.isServerSide = false;
          this.currentStaticItems = staticData;
        }
      } catch (error) {
        console.warn('Error executing dataFunction:', error);
      }
    }

    this.listObj$.pipe(takeUntil(this.componentDestroyed$)).subscribe((res) => {
      if (this.dataFunction && this.dataFunction.name !== undefined) {
        if (
          res[this.dataFunction.name as keyof typeof res] &&
          res[this.dataFunction.name as keyof typeof res][this.formControlName] &&
          res[this.dataFunction.name as keyof typeof res][this.formControlName]?.length
        ) {
          this.items$ = of(res[this.dataFunction.name as keyof typeof res][this.formControlName]);
        }
      } else {
        this.items$ = of(res[this.formControlName as keyof typeof res]);
      }
    });
  }

  updateCurrentPage() {
    if (this.endOfData) {
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
      let res = await this.selectService.getDataList(
        this.formControlName,
        this.dataFunction,
        paramObj,
        this.dataFunction.name
      );
      this.endOfData = res?.isEndOfData ?? false;
      this.isServerSide = res?.isServerSide ?? false;
      if (!this.isServerSide) {
        this.items$.subscribe((data) => {
          this.currentStaticItems = data;
        });
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
    }

    if (changes['ids']) {
      this.items$ = of([]);
      this.endOfData = false;
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
  }

  compareValues(option1: any, option2: any): boolean {
    // Handle null/undefined cases first
    if (option1 === null && option2 === null) return true;
    if (option1 === undefined && option2 === undefined) return true;
    if (option1 === null || option1 === undefined || option2 === null || option2 === undefined) return false;

    if (this.isMultiSelect) {
      // For multi-select, we store full objects, so compare by ID
      if (typeof option1 === 'object' && option1 !== null && typeof option2 === 'object' && option2 !== null) {
        return option1[this.bindValueKey] === option2[this.bindValueKey];
      } else if (typeof option1 === 'object' && option1 !== null) {
        return option1[this.bindValueKey] === option2;
      } else if (typeof option2 === 'object' && option2 !== null) {
        return option1 === option2[this.bindValueKey];
      }
    }
    
    // For single select, compare directly or by value key
    if (typeof option1 === 'object' && option1 !== null && typeof option2 === 'object' && option2 !== null) {
      return option1[this.bindValueKey] === option2[this.bindValueKey];
    } else if (typeof option1 === 'object' && option1 !== null) {
      return option1[this.bindValueKey] === option2;
    } else if (typeof option2 === 'object' && option2 !== null) {
      return option1 === option2[this.bindValueKey];
    }
    
    return option1 === option2;
  }

  getSelectedItemLabel(selectedValue: any): string {
    // For multi-select, we now store full item objects, so this is much simpler
    if (typeof selectedValue === 'object' && selectedValue !== null) {
      if (this.bindLabelKeys) {
        return this.constructLabel(selectedValue, this.bindLabelKeys);
      } else {
        // Try different possible label properties
        return selectedValue[this.bindLabelKey] || 
               selectedValue.display || 
               selectedValue.label || 
               selectedValue.name || 
               selectedValue.value || 
               'Unknown';
      }
    }
    
    // Fallback for single select or edge cases
    return selectedValue;
  }

  removeSelectedItem(index: number, event: Event): void {
    // Prevent the event from bubbling up and closing the select
    event.stopPropagation();
    event.preventDefault();
    
    if (this.isMultiSelect && this.control.value) {
      const currentValue = [...this.control.value];
      currentValue.splice(index, 1);
      this.control.setValue(currentValue);
      
      // Update the selectParams.ids if needed - extract IDs from full objects
      if (this.selectParams.ids && this.selectParams.ids.length > 0) {
        this.selectParams.ids = currentValue.map((item: any) => 
          (typeof item === 'object' && item !== null) ? item[this.bindValueKey] : item
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
      this.isSearchVisible = true;
      // Clear any previous search
      this.filterFormControl.setValue('');
      // Focus the search input after a short delay to ensure it's rendered
      setTimeout(() => {
        const searchInput = document.querySelector('.search-input-overlay') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    } else {
      this.isSearchVisible = false;
      // Clear search when select closes
      this.filterFormControl.setValue('');
    }
  }

  onSearchFocus(): void {
    // Keep search visible when focused
    this.isSearchVisible = true;
  }

  onSearchBlur(): void {
    // Hide search when blurred (unless select is still open)
    setTimeout(() => {
      if (!this.control.disabled && !this.control.value) {
        this.isSearchVisible = false;
      }
    }, 150);
  }

  hideSearch(): void {
    this.isSearchVisible = false;
    this.filterFormControl.setValue('');
    // Focus back to the select
    const selectElement = document.querySelector('.mat-mdc-select-trigger') as HTMLElement;
    if (selectElement) {
      selectElement.focus();
    }
  }
}
