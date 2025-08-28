import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { CORE_IMPORTS } from '../../shared/shared-modules';
import { ActionButtonNames } from '../../constants/action_buttons';
import { ConstPath } from '../../constants/const_path';
import { PermissionService } from '../../services/permission.service';
import { RouterService } from '../../services/router.service';
import { ModuleEnum, RoleEnum } from '../../types/enum/moduleEnum';
import { TicketFilterOptions } from '../../types/filters/ticket/ticketFilterOptions';
import { TicketNew } from '../../types/ticket';
import { TicketMenus } from '../../types/ticket/ticket-menus.model';
import { SearchFormService } from '../shared/search-bar/search-form.service';
import { TicketsSearchFormService } from './tickets-search/tickets-search-form.service';
import { TicketsService } from './tickets.service';
import { TitlesEnum } from '../../types/enum/titlesEnum';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { AuthorityService } from '../../services/authority.service ';
import { ButtonComponent } from '../shared/base/button/button.component';
import { TicketsTableNewComponent } from './tickets-table-new/tickets-table-new.component';
import { TicketsSearchComponent } from './tickets-search/tickets-search.component';
import { ActionButtonsComponent } from '../shared/action-buttons/action-buttons.component';

@Component({
  selector: 'app-tickets-new',
  imports: [
    ...CORE_IMPORTS,
    ButtonComponent,
    TicketsTableNewComponent,
    TicketsSearchComponent,
    ActionButtonsComponent
  ],
  templateUrl: './tickets-new.component.html',
  styleUrls: ['./tickets-new.component.scss'],
})
export class TicketsNewComponent implements OnInit, AfterViewInit {
  //services
  private ticketsService = inject(TicketsService);
  public ticketsSearchFormService = inject(TicketsSearchFormService);
  private routerService = inject(RouterService);
  private permissionService = inject(PermissionService);
  private searchFormService = inject(SearchFormService);
  private authorityService = inject(AuthorityService);

  currentMunicipalSig = this.authorityService.currentMunicipal;
  list: TicketNew[] = [];

  total: number = 0;

  count: number = 0;

  error: string = '';

  searchData: TicketFilterOptions | null = null;

  moduleEnum = ModuleEnum;

  title: string = TitlesEnum.TicketsSearch;

  loader: boolean = true;

  selectedTicket = signal<TicketNew | null>(null);

  emailAddress: string = '';
  phoneNumber: string = '';
  selectedTicketID: string = '';

  actionButtonsList: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  countTickets: number = 0;
  isSearchMode: boolean = false;

  Icons = ConstPath;

  foundResult: boolean = true;
  showErrorCard: boolean = false;
  errorMessage: string = ErrorSuccessMessages.SEARCH_FAILED;

  isBackOffice: boolean = false;
  currentAuthority: string | null = '';
  constructor() {
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      if (!authorityID) return;

      this.currentAuthority = authorityID;

      untracked(() => {
        this.ticketsSearchFormService.form.patchValue(
          { authorityID: authorityID },
          // { violationDetailsFilter: { authorityID: [authorityID] } },
          { emitEvent: false }
        );
        this.loadData(this.ticketsSearchFormService.form.value);
      });
    });
  }

  ngOnInit(): void {
    this.currentAuthority = this.authorityService.authorityId();
    this.isBackOffice = this.permissionService.role() === RoleEnum.BACK_OFFICE;
    this.title = this.routerService.getCurrentState().name || this.title;
  }

  ngOnDestroy() {}
  ngAfterViewInit(): void {
    this.actionButtonsComponent?.toggleDisabled(this.actionButtonsList, true);
  }

  async loadData(filter: TicketFilterOptions) {
    this.loader = true;
    try {
      console.log(filter);
      const newFilter = {
        ...filter,

        authorityID: this.currentAuthority,
      };
      console.log(newFilter);
      const res = await this.ticketsService.getTickets(newFilter);
      if (res && res.list) {
        this.list = res.list.map((p) => new TicketNew(p));
        this.total = res.list.length ? res.total : 0;
        this.count = res.count;
      }
      if (!res?.list.length) {
        this.actionButtonsComponent?.toggleDisabled(
          this.actionButtonsList,
          true
        );
      }
    } catch (e) {
      console.error(e);
    }
    this.loader = false;
  }

  back() {
    this.searchFormService.clearForm();
    this.routerService.back();
  }

  clearAll() {
    this.title = TicketMenus.ticketDefaultTitle;
    this.ticketsSearchFormService.clearForm();
  }
  onSelectedTicket(t: TicketNew | any) {
    console.log('selected ticket', t);
    this.selectedTicket.set(t);
    this.emailAddress = t?.email ?? '';
    this.phoneNumber = t?.mainPhone ?? '';
    this.selectedTicketID = t?.ticketID ?? '';
  }
}
