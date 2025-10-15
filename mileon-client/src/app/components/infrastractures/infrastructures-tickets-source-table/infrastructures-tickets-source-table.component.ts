import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChildren,
  inject,
  signal,
  computed,
  effect,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  NgbdSortableHeader,
  SortEvent,
} from '../../../directives/sortable.directive';
import { Icon } from '../../../types/icon';
import { Column, ColumnTypeEnum } from '../../../types/table';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { TableService } from '../../shared/table/table.service';
import { BaseFormComponent } from '../../shared/base-form/base-form.component';
import { TableErrors } from '../../../constants/errors';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { ConstPath } from '../../../constants/const_path';
import { RedLineErrorComponent } from '../../shared/errors/red-line-error/red-line-error.component';
import { PaginatorComponent } from '../../shared/table/paginator/paginator.component';

@Component({
  selector: 'app-infrastructures-tickets-source-table',
  templateUrl: './infrastructures-tickets-source-table.component.html',
  styleUrls: ['./infrastructures-tickets-source-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbdSortableHeader,
    RedLineErrorComponent,
    PaginatorComponent,
  ],
})
export class InfrastructuresTicketsSourceTableComponent
  extends BaseFormComponent
  implements OnInit, OnChanges
{
  private readonly tableService = inject(TableService);
  private readonly searchFormService = inject(SearchFormService);

  @Input() data: any[] = []; // Input data from the server
  @Input() columns: Column[] = [];
  @Input() total: number = 0;
  @Input() form!: FormGroup;
  @Input() count?: number;
  @Input() pageSize: number = 100;
  @Input() showPaginator: boolean = true;
  @Input() icons: Icon[] = [];
  @Input() selectedItemData!: Subject<any>;
  @Input() parentComponentName: string = '';
  @Input() loader: boolean = false;

  private readonly _combinedData = signal<{
    ticketSourceName: number;
    ticketSourceID: number;
    methods: any[];
  }[]>([]);
  private readonly _errorMsg = signal<string>('');
  private readonly _selectedPage = signal<number>(1);

  readonly combinedData = this._combinedData.asReadonly();
  readonly errorMsg = this._errorMsg.asReadonly();
  readonly selectedPage = this._selectedPage.asReadonly();
  readonly tableData = computed(() => this.tableService.sortedData());
  readonly tableTotal = computed(() => this.tableService.total());

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;
  @Output() onRowEvent = new EventEmitter<any>();
  @Output() onFormChanges = new EventEmitter<FormGroup>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onIconClick = new EventEmitter<any>();

  readonly ColumnTypeEnum = ColumnTypeEnum;
  readonly Icons = ConstPath;

  constructor() {
    super();
    
    effect(() => {
      const currentPage = this.searchFormService.form.get('currentPage');
      if (currentPage?.value) {
        this._selectedPage.set(currentPage.value);
      }
    });
  }

  ngOnInit(): void {
    this.processData();
    this.form = this.searchFormService.form;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this._combinedData.set([]);
    if (changes['data']?.currentValue?.length) {
      this.setTableData();
      this.processData();
      this._errorMsg.set('');
    } else if (
      !changes['data']?.currentValue?.length &&
      !changes['data']?.firstChange
    ) {
      this.resetTable();
      this._errorMsg.set(TableErrors.NOT_FOUND);
    }

    if (changes['loader']) {
      this.loader = changes['loader'].currentValue;
    }
  }

  processData(): void {
    const processedData = this.data.map((item) => ({
      ticketSourceName: item.ticketSourceName,
      ticketSourceID: item.ticketSourceID,
      methods: item.ticketDeliveryMethods.map((method: any) => ({
        deliveryMethodID: method.deliveryMethodID,
        deliveryMethodName: method.deliveryMethodName,
        ticketTypeName: method.ticketType.ticketTypeName,
        ticketTypeID: method.ticketType.ticketTypeID,
        ticketStageName: method.ticketStage?.name,
      })),
    }));
    this._combinedData.set(processedData);
  }

  pageChanges(currentPage: number): void {
    this.form.get('currentPage')?.setValue(currentPage);
    this.onFormChanges.emit(this.form);
  }

  setTableData(): void {
    this.tableService.columns = this.columns;
    this.tableService.setData(this.data);
    this.tableService.setTotal(this.total);
  }

  onSort({ column, direction, sortByServer }: SortEvent): void {
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });
    if (sortByServer && direction) {
      if (this.form) {
        this.form.patchValue({
          order: SortOrder[direction as keyof typeof SortOrder],
          orderByField: column,
        });
      }

      this.onFormChanges.emit(this.form);
      return;
    }
    this.tableService.setSortColumn(column);
    this.tableService.setSortDirection(direction);
  }

  onRowClick(item: any, e: MouseEvent): void {
    const event = e.target as HTMLInputElement; // for getting more attributes to target
    if (
      event &&
      (event.type === ColumnTypeEnum.Checkbox ||
        event.type === ColumnTypeEnum.Radio)
    ) {
      return;
    }
    this.onRowEvent.emit(item);
  }

  onSelectedRowIdChange(item: any): void {
    this.selectedItemData.next(item);
  }

  resetTable(): void {
    this.tableService.setData([]);
    this.tableService.setTotal(0);
    this._combinedData.set([]);
  }

  getIconById(id: number): Icon {
    return this.icons.find((icon) => icon.id === id) as Icon;
  }

  onIconClickEvent(item: any): void {
    this.onIconClick.emit(item);
  }

  hasIconColumn(): boolean {
    return this.columns.some((col) => col.type === ColumnTypeEnum.Icon);
  }
}
