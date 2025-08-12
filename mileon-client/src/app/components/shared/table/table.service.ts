import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { tap } from 'rxjs/internal/operators/tap';
import { Subject } from 'rxjs/internal/Subject';
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
  private _loading$ = new BehaviorSubject<boolean>(true);
  private _search$ = new Subject<void>();
  public dataSubject$ = new BehaviorSubject<any[]>([]);
  public totalSubject$ = new BehaviorSubject<number>(0);

  private _state: State = {
    page: 1,
    pageSize: 4,
    sortColumn: '',
    sortDirection: '',
  };

  constructor(private pipe: DecimalPipe) {  //hard to know what this method is doing specifically, a comment may help
    this._search$
      .pipe(
        tap(() => this._loading$.next(true)),
        debounceTime(200),
        switchMap(() => this._search()),
        tap(() => this._loading$.next(false))
      )
      .subscribe((result: any) => {
        this.dataSubject$.next(result.data);
        this.totalSubject$.next(result.total);
      });

    this._search$.next();
  }

  get data$() {
    return this.dataSubject$.asObservable();
  }
  get total$() {
    return this.totalSubject$.asObservable();
  }
  get loading$() {
    return this._loading$.asObservable();
  }
  get page() {
    return this._state.page;
  }
  get pageSize() {
    return this._state.pageSize;
  }

  set page(page: number) {
    this._set({ page });
  }
  set pageSize(pageSize: number) {
    this._set({ pageSize });
  }
  set sortColumn(sortColumn: string) {
    this._set({ sortColumn });
  }
  set sortDirection(sortDirection: SortDirection) {
    this._set({ sortDirection });
  }

  private _set(patch: Partial<State>) {
    Object.assign(this._state, patch);
    this._search$.next();
  }

  columns!: Column[];

  private _search(): Observable<any> {  //good use of advanced Angular mechanics
    const { sortColumn, sortDirection, pageSize, page } =
      this._state;
    // 1. sort
    // let tableData;
    let tableData: any[] = [];
    this.dataSubject$.subscribe((res) => {
      tableData = res;
      if (res?.length && this.columns) {
        tableData = [];
        const columnKeys = this.columns.map((a) => a.propertyName);

        for (let item of res) {
          let temp: any = {};
          Object.keys(item).map((field) => {
            if (columnKeys.includes(field)) {
              temp[field] = item[field];
            }
          });
          tableData.push(temp);
        }

        // tableData = res;

        tableData = sort(tableData, sortColumn, sortDirection);
        // 2. filter
        // tableData = tableData?.filter((item) =>
        //   matches(item, searchTerm, this.pipe)
        // );

        // 3. paginate
        //NOTE: Comment out the filter. temp fix. MAYA's blame
        // tableData = tableData.slice(
        //   (page - 1) * pageSize,
        //   (page - 1) * pageSize + pageSize
        // );
      }
    });
    // const total = tableData?.length;
    let total;
    this.total$.subscribe(val => {
      total = val;
    })
    return of({ data: tableData, total });
  }
}
