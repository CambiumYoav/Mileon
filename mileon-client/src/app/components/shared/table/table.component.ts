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
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Output,
} from '@angular/core';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../../directives/sortable.directive';
import { FormGroup } from '@angular/forms';
import { Icon } from '../../../types/icon';
import { BaseFormComponent } from '../base-form/base-form.component';
import { TableErrors } from '../../../constants/errors';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  
  private readonly _columns = signal<Column[]>([]);
  private readonly _icon = signal<Icon | string | undefined>(undefined);
  private readonly _data = signal<any[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _count = signal<number | undefined>(undefined);
  private readonly _pageSize = signal<number>(100);
  private readonly _showPaginator = signal<boolean>(true);
  private readonly _icons = signal<Icon[]>([]);
  private readonly _selectedPage = signal<number>(1);
  private readonly _parentComponentName = signal<string>('');
  private readonly _loader = signal<boolean>(true);
  private readonly _isCheckboxsSelected = signal<boolean>(true);
  private readonly _errorMsg = signal<string>('');

  get data(): any[] {
    return this.tableService.sortedData();
  }

  get total(): number {
    return this.tableService.total();
  }

  get columns(): Column[] {
    return this._columns();
  }

  get icon(): Icon | string | undefined {
    return this._icon();
  }

  get count(): number | undefined {
    return this._count();
  }

  get pageSize(): number {
    return this._pageSize();
  }

  get showPaginator(): boolean {
    return this._showPaginator();
  }

  get icons(): Icon[] {
    return this._icons();
  }

  get selectedPage(): number {
    return this._selectedPage();
  }

  get parentComponentName(): string {
    return this._parentComponentName();
  }

  get loader(): boolean {
    return this._loader();
  }

  get isCheckboxsSelected(): boolean {
    return this._isCheckboxsSelected();
  }

  get errorMsg(): string {
    return this._errorMsg();
  }

  // Constants
  readonly Icons = ConstPath;
  readonly ColumnTypeEnum = ColumnTypeEnum;
  readonly $event: MouseEvent = new MouseEvent('hover');

  @ViewChildren(NgbdSortableHeader) headers?: QueryList<NgbdSortableHeader>;

  @Output() onRowEvent = new EventEmitter<any>();
  @Output() onFormChanges = new EventEmitter<FormGroup>();
  @Output() onRowSelect = new EventEmitter<any>();
  rowSelected = output<any>();

  private readonly tableService = inject(TableService);
  private readonly searchFormService = inject(SearchFormService);
  private readonly cdRef = inject(ChangeDetectorRef);

  @Input() set columns(value: Column[] | undefined) {
    this._columns.set(value || []);
  }

  @Input() set icon(value: Icon | string | undefined) {
    this._icon.set(value);
  }

  @Input() set data(value: any[] | undefined) {
    this._data.set(value || []);
    this.tableService.setData(value || []);
  }

  @Input() set total(value: number) {
    this._total.set(value);
    this.tableService.setTotal(value);
  }

  @Input() form!: FormGroup;

  @Input() set count(value: number | undefined) {
    this._count.set(value);
  }

  @Input() set pageSize(value: number) {
    this._pageSize.set(value);
    this.tableService.setPageSize(value);
  }

  @Input() set showPaginator(value: boolean) {
    this._showPaginator.set(value);
  }

  @Input() set icons(value: Icon[]) {
    this._icons.set(value);
  }

  @Input() set parentComponentName(value: string) {
    this._parentComponentName.set(value);
  }

  @Input() set loader(value: boolean) {
    this._loader.set(value);
  }

  @Input() set isCheckboxsSelected(value: boolean) {
    this._isCheckboxsSelected.set(value);
  }

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if 'data' exists and has a valid value before accessing its properties
    if (changes['data']?.currentValue && changes['data'].currentValue.length) {
      this.setTableData();
      this._errorMsg.set('');
    } else if (
      changes['data']?.previousValue &&
      !changes['data'].currentValue?.length &&
      !changes['data'].firstChange
    ) {
      this.resetTable();
      this._errorMsg.set(TableErrors.NOT_FOUND);
    }

    // Check if 'loader' exists before accessing it
    if (changes['loader']?.currentValue !== undefined) {
      this._loader.set(changes['loader'].currentValue);
    }

    // Check if 'isChecked' exists before triggering change detection
    if (changes['isChecked']?.currentValue !== undefined) {
      this.cdRef.detectChanges();
    }

    // Always set table data when data changes
    if (changes['data'] && this._data() && this._data().length > 0) {
      this.setTableData();
    }
  }

  pageChanges(currentPage: number) {
    this._selectedPage.set(currentPage);
    this.form?.get('currentPage')?.setValue(currentPage);
    this.onFormChanges.emit(this.form);

    // Update table service and refresh data
    this.tableService.setPage(currentPage);
    this.setTableData();
  }

  setTableData() {
    this.tableService.columns = this._columns();
    this.tableService.setPageSize(this._pageSize());
    this.tableService.setPage(this._selectedPage());
    this.tableService.setData(this._data());
    this.tableService.setTotal(this._total());
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
    this.tableService.setSortColumn(column);
    this.tableService.setSortDirection(direction);
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
    this.tableService.setData([]);
    this.tableService.setTotal(0);
  }

  getIconById(id: number): Icon | undefined {
    const icons = this._icons();
    if (!icons || !Array.isArray(icons) || !id) {
      return undefined;
    }
    return icons.find((icon) => icon.id === id);
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

  // Removed subscription-based listenToPageReset method
  // Signals handle reactivity automatically

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
    const column = this._columns().find(col => col.propertyName === propertyName);
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
    const currentData = this._data();
    if (currentData) {
      this.tableService.setData([...currentData]);
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
    const currentData = this._data();
    if (currentData) {
      this.tableService.setData([...currentData]);
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
   * Calculate content width based on actual data
   */
  private calculateContentWidth(column: Column): number {
    const data = this._data();
    if (!data || data.length === 0) return 0;

    let maxContentLength = column.displayName.length * 8; // Base on header text

    // Sample first 10 rows to calculate max content length
    const sampleSize = Math.min(10, data.length);
    for (let i = 0; i < sampleSize; i++) {
      const item = data[i];
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


  getColumnWidth(column: Column): string {
    if (!this.columnWidths || !this.columnWidths[column.propertyName]) {
      return 'auto';
    }
    return `${this.columnWidths[column.propertyName]}px`;
  }

  // Add property to store column widths
  private columnWidths: { [key: string]: number } = {};

  /**
   * TrackBy function for better performance with *ngFor
   * Uses item.id if available, otherwise falls back to index
   */
  trackByItemId(index: number, item: any): any {
    return item?.id ?? item?.ticketNumber ?? item?.reportNumber ?? index;
  }
}