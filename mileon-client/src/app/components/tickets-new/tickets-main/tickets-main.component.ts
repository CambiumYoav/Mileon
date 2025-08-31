import { PermissionRoutes } from '../../../constants/permissions.enum';
import { AuthService } from '../../../services/auth.service';
import { PermissionService } from '../../../services/permission.service';
import { UserService } from '../../../services/user.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { ListCountResult } from '../../../types/listCountResult';
import { TicketNew } from '../../../types/ticket';
import { User } from '../../../types/user';
import { ActionButtonsComponent } from '../../shared/action-buttons/action-buttons.component';
import { LastViewedComponent } from '../../shared/last-viewed/last-viewed.component';
import { TicketsErrorNewComponent } from '../tickets-error-new/tickets-error-new.component';
import { TicketsSearchComponent } from '../tickets-search/tickets-search.component';
import { TicketsService } from '../tickets.service';
import { ActionButtonNames } from './../../../constants/action_buttons';
import { Component, inject, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-tickets-main',
  templateUrl: './tickets-main.component.html',
  styleUrls: ['./tickets-main.component.scss'],
  imports:[TicketsSearchComponent,TicketsErrorNewComponent,LastViewedComponent]
})
export class TicketsMainComponent implements OnInit {
  list: TicketNew[] = [];

  total: number = 0;

  count: number = 0;

  error: string = '';

  actionButtonsList: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  searchText: string = '';
  isSearchMode: boolean = false;
  foundResult: boolean = true;
  data!: ListCountResult<TicketNew>;
  filter!: FilterOptions;

  userID: string = '';

  userName: string = '';
  callSummaries: number = 0;

  userPaymentCount: number = 0;
  searchData!: TicketFilterOptions;
  showErrorCard: boolean = false;
  errorMessage: string = ErrorSuccessMessages.SEARCH_FAILED;
  searchPermission: boolean = true;

  private ticketsService = inject(TicketsService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private permissionsService = inject(PermissionService);

  constructor() {
    this.userService.userActivityDataSubject.subscribe((res) => {
      this.initUserActivityData();
    });
  }

  ngOnInit(): void {
    this.searchPermission = this.permissionsService.checkUserPermission(
      PermissionRoutes.TICKETS_GET_VIEW_HISTORY
    );
    const user: User | null = this.authService.getUser();
    if (user && user.UserId) {
      this.userID = user.UserId;
    }

    this.searchData = {
      searchText: this.searchText,
      orderByField: 'ViolationTime',
      order: 1,
      currentPage: 1,
    };

    this.filter = {
      searchText: '',
      currentPage: 1,
    };
  }

  async loadData(filter: TicketFilterOptions) {
    try {
      const res = await this.ticketsService.getTickets(filter);
      if (res && res.list) {
        this.list = res.list.map((p) => new TicketNew(p));
        this.total = res.list.length ? res.total : 0;
        this.count = res.count;
      }
      this.actionButtonsComponent?.toggleDisabled(
        this.actionButtonsList,
        !!res?.list.length
      ); // enable action buttons
    } catch (e) {
      console.error(e);
    }
  }

  initUserActivityData() {
    this.callSummaries = this.userService.userActivityData.callSummaryCount;
    this.userName = this.userService.userActivityData.userName;
    this.userPaymentCount = this.userService.userActivityData.userPaymentCount;
  }
}
