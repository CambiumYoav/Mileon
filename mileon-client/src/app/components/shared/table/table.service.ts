import { DecimalPipe } from '@angular/common';
import { Injectable, signal, computed, inject } from '@angular/core';
import { SortDirection } from '../../../directives/sortable.directive';
import { Column } from '../../../types/table';

interface State {
  page: number;
  pageSize: number;
  sortColumn: string;
  sortDirection: SortDirection;
}


function extractNumericPartsAsSingleNumber(str: string) {
  const numericParts = str.match(/\d+/g); // Match all sequences of digits
  if (numericParts) {
    return parseFloat(numericParts.join(''));
  }
  return NaN; // Return NaN if no numeric parts are found
}


// Helper function to check if a string contains mostly numbers
const containsMostlyNumbers = (str: string): boolean => {
  const numericPart = extractNumericPartsAsSingleNumber(str);
  if (!isNaN(numericPart)) {
    const numericRatio = numericPart.toString().length / str.length;
    // 0.5 means at least 50% of characters should be numbers
    return numericRatio >= 0.5;
  }
  return false;
};


const compareElements = (v1: string | number | Date, v2: string | number | Date): number => {
  if ((typeof v1 === 'number' && typeof v2 === 'number') || (v1 instanceof Date && v2 instanceof Date)) {
    // If both are numbers or dates, use the regular comparison
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
  } else if (typeof v1 === 'string' && typeof v2 === 'string') {
    // If both are strings, check if they contain mostly numbers
    const isV1MostlyNumbers = containsMostlyNumbers(v1);
    const isV2MostlyNumbers = containsMostlyNumbers(v2);

    if (isV1MostlyNumbers && isV2MostlyNumbers) {
      // If both contain mostly numbers, compare them as numbers
      const numericValue1 = extractNumericPartsAsSingleNumber(v1);
      const numericValue2 = extractNumericPartsAsSingleNumber(v2);
      return numericValue1 - numericValue2;
    } else if (isV1MostlyNumbers) {
      // Only v1 contains mostly numbers, so it comes before v2
      return -1;
    } else if (isV2MostlyNumbers) {
      // Only v2 contains mostly numbers, so it comes before v1
      return 1;
    } else {
      // Both are regular strings, compare them as strings
      return v1.localeCompare(v2);
    }
  } else {
    // For different types (e.g., number vs. string or date vs. string), return a comparison result based on type
    return typeof v1 < typeof v2 ? -1 : typeof v1 > typeof v2 ? 1 : 0;
  }
};

function sort(tableData: any[], column: string, direction: string): any[] {  //good design
  if (direction === '' || column === '') {
    return tableData;
  } else { //otherwise
    return [...tableData].sort((a, b) => {
      const res = compareElements(a[column], b[column]);
      return direction === 'asc' ? res : -res;
    });
  }
}

// function matches(country: any, term: string, pipe: PipeTransform) {
//   return (
//     country.name.toLowerCase().includes(term.toLowerCase()) ||
//     pipe.transform(country.area).includes(term) ||
//     pipe.transform(country.population).includes(term)
//   );
// }

@Injectable({
  providedIn: 'root',
})
export class TableService {
  // Angular 19 signals for reactive state management
  private readonly _data = signal<any[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _loading = signal<boolean>(false);
  private readonly _page = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _sortColumn = signal<string>('');
  private readonly _sortDirection = signal<SortDirection>('');

  // Computed signals for derived values
  readonly data = this._data.asReadonly();
  readonly total = this._total.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly page = this._page.asReadonly();
  readonly pageSize = this._pageSize.asReadonly();
  readonly sortColumn = this._sortColumn.asReadonly();
  readonly sortDirection = this._sortDirection.asReadonly();

  // Computed signal for sorted data
  readonly sortedData = computed(() => {
    const data = this._data();
    const sortColumn = this._sortColumn();
    const sortDirection = this._sortDirection();
    
    if (!sortColumn || !sortDirection || data.length === 0) {
      return data;
    }
    
    return sort([...data], sortColumn, sortDirection);
  });

  // Injected services using Angular 19 inject() function
  private readonly pipe = inject(DecimalPipe);

  columns!: Column[];

  // Setters for state updates
  setData(data: any[]): void {
    this._data.set(data);
  }

  setTotal(total: number): void {
    this._total.set(total);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setPage(page: number): void {
    this._page.set(page);
  }

  setPageSize(pageSize: number): void {
    this._pageSize.set(pageSize);
  }

  setSortColumn(sortColumn: string): void {
    this._sortColumn.set(sortColumn);
  }

  setSortDirection(sortDirection: SortDirection): void {
    this._sortDirection.set(sortDirection);
  }

  // Helper method to get current state
  getCurrentState(): State {
    return {
      page: this._page(),
      pageSize: this._pageSize(),
      sortColumn: this._sortColumn(),
      sortDirection: this._sortDirection(),
    };
  }

  // Method to reset all state
  reset(): void {
    this._data.set([]);
    this._total.set(0);
    this._loading.set(false);
    this._page.set(1);
    this._pageSize.set(10);
    this._sortColumn.set('');
    this._sortDirection.set('');
  }
}
