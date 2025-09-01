import { RouterService } from '../../../services/router.service';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  output,
  Output,
  signal,
} from '@angular/core';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptionsNew';
import { Column } from '../../../types/table';
import { TicketNew } from '../../../types/ticket';
import { TicketsTableService } from './tickets-table.service';
import { FormGroup } from '@angular/forms';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { Icon } from '../../../types/icon';
import { TicketsSearchFormService } from '../tickets-search/tickets-search-form.service';
import { TicketTable } from '../../../types/ticket/ticket-table.model';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-tickets-table-new',
  templateUrl: './tickets-table-new.component.html',
  styleUrls: ['./tickets-table-new.component.scss'],
  imports: [TableComponent],
})
export class TicketsTableNewComponent implements OnInit {
  @Input() showSort: boolean = false;
  @Input() sortFromClient: boolean = false;
  @Input() filters: FilterOptions = {
    currentPage: 1,
  };

  ticketForm: FormGroup;
  @Input() data!: TicketNew[];

  @Input() total!: number;

  @Input() count!: number;

  @Output() onFormChanges = new EventEmitter<TicketFilterOptions>();

  @Input() loader!: boolean;
  _columns: Column[] = [];

  get columns(): Column[] {
    return this._columns;
  }

  @Input() set tableColumns(tableName: string) {
    if (tableName)
      this._columns =
        this.ticketsTableService.table[tableName as keyof TicketTable];
  }

  @Input()
  showPaginator: boolean = true;

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;
  selectedTicket = signal<TicketNew | null>(null);
  selectedTicketChange = output<TicketNew | null>();

  private ticketsTableService = inject(TicketsTableService);
  private ticketSearchForm = inject(TicketsSearchFormService);
  private routerService = inject(RouterService);
  constructor() {
    this.ticketForm = this.ticketSearchForm.form;
  }

  ngOnInit(): void {}

  async goToDetails(ticket: TicketNew) {
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.TicketsNew.Home,
        ROUTE_PATH.TicketsNew.Ticket,
        ticket.ticketID,
      ],
      true
    );
  }

  emitServerSort(form: FormGroup) {
    this.onFormChanges.emit(form.value);
  }
  onRowSelected(ticket: TicketNew) {
    this.selectedTicket.set(ticket);
    this.selectedTicketChange.emit(ticket);
  }
}
