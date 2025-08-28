import {
  AfterViewInit,
  Component,
  effect,
  inject,
  OnInit,
  untracked,
  ViewChild,
} from '@angular/core';
import { BaseComponents, CORE_IMPORTS, SharedImports } from '../../shared/shared-modules';
import { Subject, Subscription } from 'rxjs';
import { ActionButtonNames } from '../../constants/action_buttons';
import { ConstPath } from '../../constants/const_path';

import { PermissionService } from '../../services/permission.service';
import { RouterService } from '../../services/router.service';
import { ModuleEnum, RoleEnum } from '../../types/enum/moduleEnum';
import { TicketFilterOptions } from '../../types/filters/ticket/ticketFilterOptions';
import { MyRef } from '../../types/myRef';
import { TicketNew } from '../../types/ticket';
import { TicketMenus } from '../../types/ticket/ticket-menus.model';
import { SearchFormService } from '../shared/search-bar/search-form.service';
import { TicketsSearchFormService } from './tickets-search/tickets-search-form.service';
import { TicketsService } from './tickets.service';
import { TitlesEnum } from '../../types/enum/titlesEnum';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { AuthorityService } from '../../services/authority.service ';
import { BaseFormComponent } from '../shared/base-form/base-form.component';

@Component({
  
  selector: 'app-tickets-new',
  imports: [...CORE_IMPORTS],
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

  selectedTicketData$: Subject<TicketNew> = new Subject<TicketNew>();
  subscriptions: Subscription[] = [];
  emailAddress: MyRef<string> = { current: '' };
  phoneNumber: MyRef<string> = { current: '' };

  actionButtonsList: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];

  // @ViewChild('actionButtonsComponent', { static: false })
  // actionButtonsComponent: ActionButtonsComponent;

  countTickets: number = 0;
  isSearchMode: boolean = false;
  selectedTicketID: string = '';

  Icons = ConstPath;

  foundResult: boolean = true;
  showErrorCard: boolean = false;
  errorMessage: string = ErrorSuccessMessages.SEARCH_FAILED;

  isBackOffice: boolean = false;
  currentAuthority: string | null = '';
  // constructor() {
  //   const ticketSub = this.selectedTicketData$.subscribe((updatedData) => {
  //     this.emailAddress.current = updatedData['email'] ?? '';
  //     this.phoneNumber.current = updatedData['mainPhone'] ?? '';
  //     this.selectedTicketID = updatedData['ticketID'];
  //   });
  //   this.subscriptions.push(ticketSub);

  //   // עדיף ב-constructor – יש הקשר הזרקה יציב
  //   effect(() => {
  //     const authorityID = this.authorityService.authorityId();
  //     if (!authorityID) return;

  //     this.currentAuthority = authorityID;

  //     untracked(() => {
  //       this.ticketsSearchFormService.form.patchValue(
  //         { violationDetailsFilter: { authorityID: [authorityID] } },
  //         { emitEvent: false }
  //       );
  //       this.loadData(this.ticketsSearchFormService.form.value);
  //     });
  //   });
  // }

  ngOnInit(): void {
    // this.currentAuthority = this.authorityService.authorityId();
    // this.isBackOffice = this.permissionService.role() === RoleEnum.BACK_OFFICE;
    // this.title = this.routerService.getCurrentState().name || this.title;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
  ngAfterViewInit(): void {
    // this.actionButtonsComponent?.toggleDisabled(this.actionButtonsList, true);
  }

  // NOTE duplicated with tickets-main
  async loadData(filter: TicketFilterOptions) {
    this.loader = true;
    try {
      const res = await this.ticketsService.getTickets(filter);
      if (res && res.list) {
        this.list = res.list.map((p) => new TicketNew(p));
        this.total = res.list.length ? res.total : 0;
        this.count = res.count;
      }
      if (!res?.list.length) {
        // this.actionButtonsComponent?.toggleDisabled(
        //   this.actionButtonsList,
        //   true
        // );
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
}
