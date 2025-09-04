import { SearchFormService } from './../search-bar/search-form.service';
import { TableService } from './table.service';
import { Column, ColumnTypeEnum, RadioButtonConfig } from './../../../types/table';
import {
  ChangeDetectorRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  output,
  SimpleChanges,
} from '@angular/core';
import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
} from '@angular/core';
import { Observable } from 'rxjs';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../../directives/sortable.directive';
import { FormGroup } from '@angular/forms';
import { Icon } from '../../../types/icon';
import { BaseFormComponent } from '../base-form/base-form.component';
import { TableErrors } from '../../../constants/errors';
import { Subject } from 'rxjs';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { ConstPath } from '../../../constants/const_path';
import { SharedImports } from '../../../shared/shared-modules';
import { RenderIdentityPipe } from '../../../pipes/identity.pipe';
import { PaginatorComponent } from './paginator/paginator.component';
import { TagComponent } from '../base/tag/tag.component';
import { CheckboxComponent } from '../base/checkbox/checkbox.component';
import { RadioButtonComponent } from '../base/radio-button/radio-button.component';
// import { RedLineErrorComponent } from '../errors/red-line-error/red-line-error.component';
import { IconComponent } from "../base/icon/icon.component";
import { TruncatedTextTooltipDirective } from '../../../directives/truncated-text-tooltip.directive';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [
    SharedImports,
    NgbdSortableHeader,
    RenderIdentityPipe,
    PaginatorComponent,
    TagComponent,
    CheckboxComponent,
    RadioButtonComponent,
    IconComponent,
    TruncatedTextTooltipDirective,
  ],
  providers: [TableService],
})
export class TableComponent
  extends BaseFormComponent
  implements OnInit, OnChanges, OnDestroy
{
  Icons = ConstPath;
  errorMsg: string = '';

  @Input()
  columns?: Column[];

  @Input()
  icon?: Icon | string;

  @Input()
  data?: any[];

  @Input()
  total: number = 0;

  @Input()
  form?: FormGroup;

  @Input()
  count?: number;

  @Input()
  pageSize: number = 100;

  @Input()
  showPaginator: boolean = true;

  @Input()
  icons: Icon[] = [];

  rowSelected = output<any>();
  selectedPage: number = 1;

  @Input()
  parentComponentName!: string;

  @Input() loader: boolean = true;

  @Input() isCheckboxsSelected: boolean = true;

  data$: Observable<any[]>;

  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers?: QueryList<NgbdSortableHeader>;

  @Output() onRowEvent = new EventEmitter<any>();

  @Output() onFormChanges = new EventEmitter<FormGroup>();

  @Output() onRowSelect = new EventEmitter<any>();

  ColumnTypeEnum = ColumnTypeEnum;
  $event: MouseEvent = new MouseEvent('hover');

  constructor(
    private tableService: TableService,
    private searchFormService: SearchFormService,
    private cdRef: ChangeDetectorRef
  ) {
    super();
    this.data$ = tableService.data$;
    this.total$ = tableService.total$;
  }

  ngOnInit(): void {
    this.listenToPageReset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if 'data' exists and has a valid value before accessing its properties
    if (changes['data']?.currentValue && changes['data'].currentValue.length) {
      this.setTableData();
      this.errorMsg = '';
    } else if (
      changes['data']?.previousValue &&
      !changes['data'].currentValue?.length &&
      !changes['data'].firstChange
    ) {
      this.total$ = this.tableService.total$;
      this.resetTable();
      this.errorMsg = TableErrors.NOT_FOUND;
    }

    // Check if 'loader' exists before accessing it
    if (changes['loader']?.currentValue !== undefined) {
      this.loader = changes['loader'].currentValue;
    }

    // Check if 'isChecked' exists before triggering change detection
    if (changes['isChecked']?.currentValue !== undefined) {
      this.cdRef.detectChanges();
    }

    // Always set table data when data changes
    if (changes['data'] && this.data && this.data.length > 0) {
      this.setTableData();
    }
  }

  pageChanges(currentPage: number) {
    this.selectedPage = currentPage;
    this.form?.get('currentPage')?.setValue(currentPage);
    this.onFormChanges.emit(this.form);

    // Update table service and refresh data
    this.tableService.page = currentPage;
    this.setTableData();
  }

  setTableData() {
    this.tableService.columns = this.columns || [];
    this.tableService.pageSize = this.pageSize as number;
    this.tableService.page = this.selectedPage;
    this.tableService.dataSubject$.next(this.data || []);
    this.tableService.totalSubject$.next(this.total);
    
    // Calculate column widths after data is set
    setTimeout(() => {
      this.calculateColumnWidths();
    }, 100);
  }

  onSort({ column, direction, sortByServer }: SortEvent) {
    // resetting other headers
    this.headers?.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    // const order = direction === 'asc' ? 0 : 1;
    if (sortByServer && direction) {
      if (this.form) {
        this.form.patchValue({
          order: SortOrder[direction],
          orderByField: column,
        });
      }
      this.onFormChanges.emit(this.form);
      return;
    }
    this.tableService.sortColumn = column;
    this.tableService.sortDirection = direction;
  }

  onRowClick(item: any, e: MouseEvent) {
    const event = e.target as HTMLInputElement; // for getting more attributes to target
    const iconName = event
      .getAttribute('src')
      ?.split('/')
      .pop()
      ?.replace('.png', '');
    if (event && ColumnTypeEnum.Icon && iconName) {
      this.onRowEvent.emit({ item, iconName });
      return;
    }
    if (
      event &&
      (event.type === ColumnTypeEnum.Checkbox ||
        event.type === ColumnTypeEnum.Radio)
    ) {
      return;
    }
    this.onRowEvent.emit(item);
  }

  onSelectedRowIdChange(item: any) {
    this.rowSelected.emit(item);
  }
  resetTable() {
    this.tableService.dataSubject$.next([]);
    this.tableService.totalSubject$.next(0);
  }

  getIconById(id: number): Icon | undefined {
    if (!this.icons || !Array.isArray(this.icons) || !id) {
      return undefined;
    }
    return this.icons.find((icon) => icon.id === id);
  }

  getIconPath(iconName: string | Icon | undefined): string {
    if (!iconName) {
      return this.Icons.EDIT;
    }

    // If it's already a string path, return it directly
    if (typeof iconName === 'string') {
      return iconName;
    }

    // If it's an Icon object, use its src property
    if (iconName && typeof iconName === 'object' && 'src' in iconName) {
      return iconName.src;
    }

    // Use type assertion to access the static property dynamically
    return (this.Icons as any)[iconName] || this.Icons.EDIT;
  }

  // listenToPageReset() {
  //   const currentPage = this.searchFormService.form.get('currentPage');
  //   if (currentPage)
  //     this.onValueChanges(currentPage).subscribe((res) => {
  //       this.selectedPage = res;
  //     });
  // }
  listenToPageReset() {
    // Use searchFormService form instead of local form reference
    const currentPage = this.searchFormService.form.get('currentPage');
    if (currentPage) {
      this.onValueChanges(currentPage).subscribe((res: any) => {
        this.selectedPage = res || 1; // Default to 1 if null/undefined
      });
    }

    // Also listen to the form directly if it's passed as input
    if (this.form) {
      const formCurrentPage = this.form.get('currentPage');
      if (formCurrentPage) {
        this.onValueChanges(formCurrentPage).subscribe((res: any) => {
          this.selectedPage = res || 1;
        });
      }
    }
  }

  getRadioColorClassByLastTicketTime(timeStr: string | null): string {
    if (!timeStr) return 'gray';

    const [hours, minutes] = timeStr.split(':').map(Number);
    const ticketDate = new Date();
    ticketDate.setHours(hours, minutes, 0, 0);

    const now = new Date();
    const diffMinutes = Math.floor(
      (now.getTime() - ticketDate.getTime()) / 60000
    );

    if (diffMinutes <= 10) return 'green-blink';
    if (diffMinutes <= 20) return 'yellow-blink';
    if (diffMinutes <= 30) return 'orange-blink';
    if (diffMinutes <= 60) return 'red-blink';
    return 'gray';
  }

  onRadioChange(item: any, propertyName: string, value: string): void {
    // Update the item's property value
    item[propertyName] = value;
    
    // Update boolean state for each option
    const column = this.columns?.find(col => col.propertyName === propertyName);
    if (column?.radioConfig?.options) {
      // Store boolean state for each option
      const booleanStateProperty = `${propertyName}_booleanState`;
      item[booleanStateProperty] = {};
      
      column.radioConfig.options.forEach(option => {
        item[booleanStateProperty][option.value] = option.value === value;
      });
    }
    
    // Emit the change event
    this.onSelectedRowIdChange(item);

    // Update the table service data to reflect the change
    if (this.data) {
      this.tableService.dataSubject$.next([...this.data]);
    }
  }

  onRadioSelectionState(item: any, propertyName: string, state: {[key: string]: boolean}): void {
    // Store the boolean state for each option
    const booleanStateProperty = `${propertyName}_booleanState`;
    item[booleanStateProperty] = state;
    
    // Emit the change event
    this.onSelectedRowIdChange(item);
  }

  onInputChange(item: any, propertyName: string, event: any): void {
    // Update the item's property value
    item[propertyName] = event.target.value;

    // Emit the change event
    this.onSelectedRowIdChange(item);

    // Update the table service data to reflect the change
    if (this.data) {
      this.tableService.dataSubject$.next([...this.data]);
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    // Allow only numeric input (0-9) and control keys
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar) && event.charCode !== 0) {
      event.preventDefault();
    }
  }

  onEditClick(item: any): void {
    // Emit the edit event with the item data
    this.onRowEvent.emit({ item, action: 'edit' });
  }

  getRadioOptions(column: Column, item: any): { value: string; label: string; colorClass?: string }[] {
    if (column.radioConfig?.options) {
      // Use configured options, processing dynamic values if needed
      return column.radioConfig.options.map(option => {
        let colorClass = option.colorClass;
        
        // Handle dynamic color class based on special function calls
        if (colorClass === 'getRadioColorClassByLastTicketTime()') {
          colorClass = this.getRadioColorClassByLastTicketTime(item.lastTicketTime);
        }
        
        return {
          ...option,
          colorClass
        };
      });
    }
    
    // Fallback to default yes/no options for backward compatibility
    return [
      { value: 'כן', label: 'כן' },
      { value: 'לא', label: 'לא' }
    ];
  }

  getRadioName(column: Column, item: any): string {
    if (column.radioConfig?.name) {
      return `${column.radioConfig.name}-${item.id}`;
    }
    return `${column.propertyName}-${item.id}`;
  }

  getRadioType(column: Column): 'default' | 'colored' {
    return column.radioConfig?.type || 'default';
  }

  getRadioDirection(column: Column): 'horizontal' | 'vertical' {
    return column.radioConfig?.direction || 'horizontal';
  }

  getRadioBooleanState(item: any, propertyName: string): {[key: string]: boolean} {
    const booleanStateProperty = `${propertyName}_booleanState`;
    return item[booleanStateProperty] || {};
  }

  isRadioOptionSelected(item: any, propertyName: string, optionValue: string): boolean {
    const booleanState = this.getRadioBooleanState(item, propertyName);
    return booleanState[optionValue] || false;
  }

  getAllowDeselect(column: Column): boolean {
    return column.radioConfig?.allowDeselect || false;
  }

  /**
   * Calculate optimal column widths based on content and column type
   */
  calculateColumnWidths(): void {
    if (!this.columns || !this.data || this.data.length === 0) {
      return;
    }

    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;

    const availableWidth = tableContainer.clientWidth - 20; // Account for padding and scrollbar
    const columnWidths: { [key: string]: number } = {};

    // Calculate base widths for each column
    this.columns.forEach(column => {
      if (column.type === ColumnTypeEnum.Hidden) return;

      let baseWidth = this.getBaseWidthForColumnType(column);
      
      // Adjust based on content length
      const contentWidth = this.calculateContentWidth(column);
      baseWidth = Math.max(baseWidth, contentWidth);

      columnWidths[column.propertyName] = baseWidth;
    });

    // Normalize widths to fit available space
    const totalCalculatedWidth = Object.values(columnWidths).reduce((sum, width) => sum + width, 0);
    const scaleFactor = availableWidth / totalCalculatedWidth;

    // Apply calculated widths
    Object.keys(columnWidths).forEach(propertyName => {
      const finalWidth = Math.max(columnWidths[propertyName] * scaleFactor, 80); // Minimum 80px
      columnWidths[propertyName] = finalWidth;
    });

    // Store widths for CSS application
    this.columnWidths = columnWidths;
  }

  /**
   * Get base width for different column types
   */
  private getBaseWidthForColumnType(column: Column): number {
    switch (column.type) {
      case ColumnTypeEnum.Checkbox:
      case ColumnTypeEnum.Radio:
      case ColumnTypeEnum.ActiveStatus:
        return 60;
      case ColumnTypeEnum.Icon:
        return 50;
      case ColumnTypeEnum.Currency:
        return 120;
      case ColumnTypeEnum.Date:
      case ColumnTypeEnum.DateTime:
        return 140;
      case ColumnTypeEnum.Tag:
        return 100;
      case ColumnTypeEnum.Text:
        // For text columns, check if it's likely to be long content
        if (column.propertyName === 'name' || column.propertyName === 'fullName') {
          return 200;
        }
        if (column.propertyName === 'ticketNumber' || column.propertyName === 'reportNumber') {
          return 150;
        }
        if (column.propertyName === 'nid' || column.propertyName === 'identity') {
          return 120;
        }
        return 100;
      default:
        return 100;
    }
  }

  /**
   * Calculate content width based on actual data
   */
  private calculateContentWidth(column: Column): number {
    if (!this.data || this.data.length === 0) return 0;

    let maxContentLength = column.displayName.length * 8; // Base on header text

    // Sample first 10 rows to calculate max content length
    const sampleSize = Math.min(10, this.data.length);
    for (let i = 0; i < sampleSize; i++) {
      const item = this.data[i];
      const content = this.getDisplayValue(item, column);
      if (content) {
        const contentLength = content.toString().length;
        maxContentLength = Math.max(maxContentLength, contentLength);
      }
    }

    // Convert character count to approximate pixel width
    // Hebrew characters are typically wider, so we use 10px per character
    return Math.min(maxContentLength * 10, 300); // Cap at 300px
  }

  /**
   * Get display value for a column
   */
  private getDisplayValue(item: any, column: Column): any {
    switch (column.type) {
      case ColumnTypeEnum.Currency:
        return item[column.propertyName] ? `₪ ${item[column.propertyName]}` : '';
      case ColumnTypeEnum.Date:
        return item[column.propertyName] ? new Date(item[column.propertyName]).toLocaleDateString('he-IL') : '';
      case ColumnTypeEnum.DateTime:
        return item[column.propertyName] ? new Date(item[column.propertyName]).toLocaleString('he-IL') : '';
      default:
        return item[column.propertyName] || '';
    }
  }

  /**
   * Get CSS width for a column
   */
  getColumnWidth(column: Column): string {
    if (!this.columnWidths || !this.columnWidths[column.propertyName]) {
      return 'auto';
    }
    return `${this.columnWidths[column.propertyName]}px`;
  }

  // Add property to store column widths
  private columnWidths: { [key: string]: number } = {};
}