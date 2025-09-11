  import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  signal,
  computed,
  inject,
  DestroyRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { User } from '../../../types/user';
import { RouterService } from '../../../services/router.service';
import { TerminalTableService } from './terminal-table.service';
import { TerminalSearchService } from '../terminal-search/terminal-search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableComponent } from "../../shared/table/table.component";
import { MsofonTable } from '../../../types/terminal/terminal-table';

@Component({
  selector: 'app-terminal-table',

  templateUrl: './terminal-table.component.html',
  styleUrls: ['./terminal-table.component.scss'],
  imports: [TableComponent],
})
export class TerminalTableComponent {
  private readonly _showSort = signal<boolean>(false);
  private readonly _sortFromClient = signal<boolean>(false);
  private readonly _filters = signal<FilterOptions>({ currentPage: 1 });
  private readonly _terminalForm = signal<FormGroup | null>(null);
  private readonly _data = signal<any[]>([]);
  private readonly _total = signal<number>(0);
  private readonly _count = signal<number>(0);
  private readonly _selectedTicketData = signal<any>(null);
  private readonly _isChecked = signal<boolean>(false);
  private readonly _loader = signal<boolean>(true);
  private readonly _columns = signal<Column[]>([]);
  private readonly _tableColumns = signal<string>('');
  private readonly _showPaginator = signal<boolean>(true);
  private readonly _resetTrigger = signal<number>(0);
  private readonly _pageSize = signal<number>(100);

  get showSort(): boolean {
    return this._showSort();
  }

  get sortFromClient(): boolean {
    return this._sortFromClient();
  }

  get filters(): FilterOptions {
    return this._filters();
  }

  get terminalForm(): FormGroup | null {
    return this._terminalForm();
  }

  get data(): any[] {
    return this._data();
  }

  get total(): number {
    return this._total();
  }

  get count(): number {
    return this._count();
  }

  get selectedTicketData(): any {
    return this._selectedTicketData();
  }

  get isChecked(): boolean {
    return this._isChecked();
  }

  get loader(): boolean {
    return this._loader();
  }

  get columns(): Column[] {
    return this._columns();
  }

  get showPaginator(): boolean {
    return this._showPaginator();
  }

  get resetTrigger(): number {
    return this._resetTrigger();
  }

  get pageSize(): number {
    return this._pageSize();
  }

  @Input()
  set showSort(value: boolean) {
    this._showSort.set(value);
  }

  @Input()
  set sortFromClient(value: boolean) {
    this._sortFromClient.set(value);
  }

  @Input()
  set filters(value: FilterOptions) {
    this._filters.set(value);
  }

  @Input()
  set terminalForm(value: FormGroup) {
    this._terminalForm.set(value);
  }

  @Input()
  set data(value: any[]) {
    this._data.set(value);
  }

  @Input()
  set total(value: number) {
    this._total.set(value);
  }

  @Input()
  set count(value: number) {
    this._count.set(value);
  }

  @Input()
  set selectedTicketData(value: any) {
    this._selectedTicketData.set(value);
  }

  @Input()
  set isChecked(value: boolean) {
    this._isChecked.set(value);
  }

  @Input()
  set loader(value: boolean) {
    this._loader.set(value);
  }

  @Input()
  set tableColumns(tableName: string) {
    this._tableColumns.set(tableName);
    if (tableName) {
      this._columns.set(this.terminalTableService.table[tableName as keyof MsofonTable]);
    }
  }

  @Input()
  set showPaginator(value: boolean) {
    this._showPaginator.set(value);
  }

  @Input()
  set resetTrigger(value: number) {
    this._resetTrigger.set(value);
  }

  @Input()
  set pageSize(value: number) {
    this._pageSize.set(value);
  }

  @Output() onFormChanges = new EventEmitter<TicketFilterOptions>();
  @Output() onRowClick = new EventEmitter<any>();
  

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private readonly terminalTableService = inject(TerminalTableService);
  private readonly terminalSearchForm = inject(TerminalSearchService);
  private readonly routerService = inject(RouterService);
  private readonly sessionService = inject(SessionService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {}

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}

  updateAllCheckboxes(isChecked: boolean) {
    const currentData = this.data;
    currentData.forEach((item) => {
      item.isSelected = isChecked;
    });
    this._data.set([...currentData])
    this._isChecked.set(isChecked);
  }

  emitRowData(rowData: any) {
    this.onRowClick.emit(rowData);
  }

  onRowSelection(item: any) {
    // Clear all selections first
    const currentData = this.data;
    currentData.forEach((row) => {
      row.isSelected = false;
    });
    
    item.isSelected = 'selected';
    
    this._data.set([...currentData]);
    
    this.onRowClick.emit(item);
  }

  emitServerSort(form: FormGroup) {
    this.onFormChanges.emit(form.value);
  }

  getTerminalForm(): FormGroup {
    return this.terminalForm || new FormGroup({});
  }
}
