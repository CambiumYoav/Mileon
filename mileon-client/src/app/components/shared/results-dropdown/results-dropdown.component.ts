import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
// import { TicketsTableService } from '../../tickets-new/tickets-table-new/tickets-table.service';
import { Column } from '../../../types/table'; 
import { TicketNew } from '../../../types/ticket';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { Icon } from '../../../types/icon';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-results-dropdown',
  templateUrl: './results-dropdown.component.html',
  styleUrls: ['./results-dropdown.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SharedImports],
})
export class ResultsDropdownComponent implements OnInit {
  // Angular 19 signals for reactive state management
  private readonly _resultData = signal<any[]>([]);
  private readonly _loader = signal<boolean>(false);
  private readonly _form = signal<any>(null);
  private readonly _originalData = signal<any[]>([]);

  // Getters for template access
  get resultData(): any[] {
    return this._resultData();
  }

  get loader(): boolean {
    return this._loader();
  }

  get form(): any {
    return this._form();
  }

  get originalData(): any[] {
    return this._originalData();
  }

  // Constants
  readonly parentComponentName = 'ResultsDropdownComponent';
  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  // Injected services using Angular 19 inject() function
  private readonly routerService = inject(RouterService);

  // Outputs
  @Output() optionSelected = new EventEmitter<any>();

  // Inputs with setters
  @Input() set resultData(value: any[]) {
    this._resultData.set(value);
  }

  @Input() set loader(value: boolean) {
    this._loader.set(value);
  }

  @Input() set form(value: any) {
    this._form.set(value);
  }

  @Input() set originalData(value: any[]) {
    this._originalData.set(value);
  }

  // Computed signal for unique options
  readonly uniqueOptions = computed(() => {
    const resultData = this._resultData();
    const form = this._form();
    
    if (!resultData || !form) return [];
    
    const searchText = form.get('searchText')?.value || '';
    if (!searchText) return [];
    
    // Get unique values based on what the user is searching for
    // This works with any table structure dynamically
    const uniqueValues = new Set<string>();
    const uniqueItems: any[] = [];
    
    for (const item of resultData) {
      let displayValue = '';
      
      // Find the field that matches the search text
      for (const [key, value] of Object.entries(item)) {
        if (value && typeof value === 'string' && value.includes(searchText)) {
          displayValue = value;
          break;
        }
        if (value && typeof value === 'number' && value.toString().includes(searchText)) {
          displayValue = value.toString();
          break;
        }
      }
      
      if (displayValue && !uniqueValues.has(displayValue)) {
        uniqueValues.add(displayValue);
        uniqueItems.push({ ...item, displayValue });
      }
    }
    
    return uniqueItems;
  });

  constructor() {
    // this.columns = this.ticketsTableService.table.ResultsDropdownColumns;
  }

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }


  getDisplayText(item: any): string {
    // Get the search text from the form to understand what the user is searching for
    const form = this._form();
    const searchText = form?.get('searchText')?.value || '';
    
    if (!searchText) {
      return 'אופציה';
    }

    // Dynamically find the field that matches the search text
    // This works with any table structure, not just specific columns
    for (const [key, value] of Object.entries(item)) {
      if (value && typeof value === 'string' && value.includes(searchText)) {
        return value;
      }
      if (value && typeof value === 'number' && value.toString().includes(searchText)) {
        return value.toString();
      }
    }
    
    // If no direct match found, return the first meaningful string/number value
    for (const [key, value] of Object.entries(item)) {
      if (value && typeof value === 'string' && value.trim() !== '') {
        return value;
      }
      if (value && typeof value === 'number') {
        return value.toString();
      }
    }
    
    return 'אופציה';
  }

  async goToDetails(item: any) {
    const form = this._form();
    
    // Update the search bar with the selected value
    if (form && item.displayValue) {
      form.patchValue({ searchText: item.displayValue }, { emitEvent: false });
    }
    
    // Filter the original data based on the selected option
    const filteredData = this.filterDataBySelection(item);
    
    // Emit the filtered data
    this.optionSelected.emit(filteredData);
  }

  private filterDataBySelection(selectedItem: any): any[] {
    const originalData = this._originalData();
    const form = this._form();
    
    if (!originalData || !form) return [];
    
    const searchText = form.get('searchText')?.value || '';
    if (!searchText) return [];
    
    // Find the field that matches the search text and filter by it
    for (const [key, value] of Object.entries(selectedItem)) {
      if (value && typeof value === 'string' && value.includes(searchText)) {
        // Filter by this field value
        return originalData.filter(item => item[key] === value);
      }
      if (value && typeof value === 'number' && value.toString().includes(searchText)) {
        // Filter by this field value
        return originalData.filter(item => item[key] === value);
      }
    }
    
    // If no match found, return the selected item only
    return [selectedItem];
  }
}
