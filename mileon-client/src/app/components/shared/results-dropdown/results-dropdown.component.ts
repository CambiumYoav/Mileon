import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  imports: [SharedImports],
})
export class ResultsDropdownComponent implements OnInit {
  @Input()
  resultData!: any[];

  @Input() loader!: boolean;

  @Input() form!: any;

  @Input() originalData: any[] = [];

  @Output() optionSelected = new EventEmitter<any>();

  parentComponentName: string = 'ResultsDropdownComponent';

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  constructor(
    // private ticketsTableService: TicketsTableService,
    private routerService: RouterService
  ) {
    // this.columns = this.ticketsTableService.table.ResultsDropdownColumns;
  }

  ngOnInit(): void {}

  getUniqueOptions(): any[] {
    if (!this.resultData || !this.form) return [];
    
    const searchText = this.form.get('searchText')?.value || '';
    if (!searchText) return [];
    
    // Get unique values based on what the user is searching for
    // This works with any table structure dynamically
    const uniqueValues = new Set<string>();
    const uniqueItems: any[] = [];
    
    for (const item of this.resultData) {
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
  }

  getDisplayText(item: any): string {
    // Get the search text from the form to understand what the user is searching for
    const searchText = this.form?.get('searchText')?.value || '';
    
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
    // Update the search bar with the selected value
    if (this.form && item.displayValue) {
      this.form.patchValue({ searchText: item.displayValue }, { emitEvent: false });
    }
    
    // Filter the original data based on the selected option
    const filteredData = this.filterDataBySelection(item);
    
    // Emit the filtered data
    this.optionSelected.emit(filteredData);
  }

  private filterDataBySelection(selectedItem: any): any[] {
    if (!this.originalData || !this.form) return [];
    
    const searchText = this.form.get('searchText')?.value || '';
    if (!searchText) return [];
    
    // Find the field that matches the search text and filter by it
    for (const [key, value] of Object.entries(selectedItem)) {
      if (value && typeof value === 'string' && value.includes(searchText)) {
        // Filter by this field value
        return this.originalData.filter(item => item[key] === value);
      }
      if (value && typeof value === 'number' && value.toString().includes(searchText)) {
        // Filter by this field value
        return this.originalData.filter(item => item[key] === value);
      }
    }
    
    // If no match found, return the selected item only
    return [selectedItem];
  }
}
