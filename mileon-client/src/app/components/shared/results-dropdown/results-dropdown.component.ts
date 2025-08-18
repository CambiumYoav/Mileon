import { Component, Input, OnInit } from '@angular/core';
// import { TicketsTableService } from '../../tickets-new/tickets-table-new/tickets-table.service';
import { Column } from '../../../types/table'; 
import { TicketNew } from '../../../types/ticket';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { Icon } from '../../../types/icon';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { TableComponent } from '../table/table.component';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-results-dropdown',
  templateUrl: './results-dropdown.component.html',
  styleUrls: ['./results-dropdown.component.scss'],
  standalone: true,
  imports: [SharedImports, TableComponent],
})
export class ResultsDropdownComponent implements OnInit {
  @Input()
  resultData!: any[];

  @Input() loader!: boolean;

  columns: Column[] = [];

  parentComponentName: string = 'ResultsDropdownComponent';

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  constructor(
    // private ticketsTableService: TicketsTableService,
    private routerService: RouterService
  ) {
    // this.columns = this.ticketsTableService.table.ResultsDropdownColumns;
  }

  ngOnInit(): void {}

  async goToDetails(ticket: TicketNew) {
    await this.routerService.navigateToUrl([
      ROUTE_PATH.TicketsNew.Home,
      ROUTE_PATH.TicketsNew.Ticket,
      ticket.ticketID,
    ]);
  }
}
