
import { TicketsService } from './../../tickets-new/tickets.service';
import { Component, OnInit } from '@angular/core';
import { TicketsTableService } from '../../tickets-new/tickets-table-new/tickets-table.service';
import { TableComponent } from '../table/table.component';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { AuthService } from '../../../services/auth.service';
import { RouterService } from '../../../services/router.service';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketNew } from '../../../types/ticket';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { User } from '../../../types/user';


@Component({
  selector: 'app-last-viewed',
  templateUrl: './last-viewed.component.html',
  styleUrls: ['./last-viewed.component.scss'],
  imports:[TableComponent]
})
export class LastViewedComponent implements OnInit {
  // NOTE supposed to be generic and dynamic but for now only applies tickets module

  tableData: TicketNew[] = [];

  total = this.tableData.length;

  columns: Column[] = [];

  userID = '';

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  loader: boolean = true;

  constructor(
    private ticketsService: TicketsService,
    private ticketsTableService: TicketsTableService,
    private routerService: RouterService,
    private authService: AuthService
  ) {
    this.columns = this.ticketsTableService.table.MainColumns;
  }

  ngOnInit(): void {
    const user: User | null = this.authService.getUser();
    if (user && user.UserId) {
      this.userID = user.UserId;
    }
    this.initLastViewed();
  }

  async initLastViewed() {
    this.loader = true;
    const res = await this.ticketsService.getViewTicketHistory(this.userID);
    this.tableData = res.map((r) => new TicketNew(r));
    this.loader = false;
  }

  async goToDetails(ticket: TicketNew) {
    await this.routerService.navigateToUrl(
      [
        ROUTE_PATH.TicketsNew.Home,
        ROUTE_PATH.TicketsNew.Ticket,
        ticket.ticketID,
      ],
      true
    );
  }
}
