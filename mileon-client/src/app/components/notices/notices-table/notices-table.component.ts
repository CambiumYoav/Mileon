import { Component, EventEmitter, Input, OnInit, Output, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ROUTE_PATH } from '../../../constants/routerPath';  
import { FilterOptions } from '../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions'; 
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketNew } from '../../../types/ticket';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { RouterService } from '../../../services/router.service';
import { TicketsSearchFormService } from '../../tickets-new/tickets-search/tickets-search-form.service';
import { NoticesTableService } from './notices-table.service';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-notices-table',
  templateUrl: './notices-table.component.html',
  styleUrls: ['./notices-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TableComponent
  ]
})
export class NoticesTableComponent implements OnInit {
  @Input() showSort: boolean = false;
  @Input() sortFromClient: boolean = false;
  @Input() filters: FilterOptions = {
    currentPage: 1,
  };
  @Input() data: any[] = [];
  @Input() total: number = 0;
  @Input() count: number = 0;
  @Input() loader: boolean = false;
  @Input() showPaginator: boolean = true;

  @Output() onFormChanges = new EventEmitter<TicketFilterOptions>();
  @Output() onRowClick = new EventEmitter<any>();
  @Output() onRowEvent = new EventEmitter<any>();
  @Output() onManaSelected = new EventEmitter<any>();

  private readonly _columns = signal<Column[]>([]);
  private readonly _selectedManaData = signal<TicketNew | null>(null);

  readonly columns = computed(() => this._columns());
  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private readonly ticketSearchForm = inject(TicketsSearchFormService);
  private readonly routerService = inject(RouterService);
  private readonly noticesTableService = inject(NoticesTableService);

  ticketForm: FormGroup;

  constructor() {
    this.ticketForm = this.ticketSearchForm.searchForm;
  }

  @Input() set tableColumns(tableName: string) {
    if (tableName) {
      this._columns.set((this.noticesTableService.table as any)[tableName]);
    }
  }

  @Input() set selectedManaData(value: TicketNew | null) {
    this._selectedManaData.set(value);
    if (value) {
      this.onManaSelected.emit(value);
    }
  }

  get selectedManaData(): TicketNew | null {
    return this._selectedManaData();
  }

  ngOnInit(): void {}

  emitServerSort(form: FormGroup) {
    this.onFormChanges.emit(form.value);
  }

  emitRowData(rowData: any) {
    this.onRowClick.emit(rowData);
    this.onManaSelected.emit(rowData);
  }
}
