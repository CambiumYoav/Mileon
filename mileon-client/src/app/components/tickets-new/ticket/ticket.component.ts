import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { ActionService } from '../../../services/action.service';
import { AuthService } from '../../../services/auth.service';
import { TicketService } from '../../../services/ticket.service';
import { SideMenu } from '../../../types/base/menu.model';
import { TicketMenus } from '../../../types/ticket/ticket-menus.model';
import { TicketDetails } from '../../../types/ticketDetails';
import { User } from '../../../types/user';
import { TicketActionButtonsComponent } from './ticket-action-buttons/ticket-action-buttons.component';
import { SideMenuComponent } from "../../shared/base/menu/side-menu/side-menu.component";


@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  imports: [RouterModule, SideMenuComponent]
})
export class TicketComponent implements OnInit, OnDestroy {
  @ViewChild('ticketAction') TicketActionButtons!: TicketActionButtonsComponent;
  // @ViewChild(SideMenuComponent) SideMenu: SideMenuComponent;

  ticketID='';
  userID: string = '';
  ticketDetails!: TicketDetails;
  arrowSvg: string='';
  paymentFor: string='';

  menu: SideMenu = TicketMenus.TicketSideMenu;
  // do view child and change the selected tab number

  isOpenNotes: boolean = false;
  title: string='';
  showMicrophone: boolean = false;
  subscriber:any=null;

  constructor(
    private ticketService: TicketService,
    private _Activatedroute: ActivatedRoute,
    private _router: Router,
    private actionService: ActionService,
    private authService: AuthService
  ) {
    this.ticketService.afterGetTicketDetails.subscribe((res) => {
      if (res) {
        this.ticketDetails = res;
      }
    });
    this.ticketService._goToTabNumber.subscribe((tabNumber: number) => {
      // this.SideMenu.selected = tabNumber;
    });
  }

  ngOnDestroy(): void {
    this.subscriber.unsubscribe();
  }

  ngOnInit(): void {
    const user: User | null = this.authService.getUser();
    if (user && user.UserId) {
      this.userID = user.UserId;
    }
    this.ticketID = this._Activatedroute.snapshot.paramMap.get('id')!;
    // this.subscriber = this.actionService.clickedNote.effect((value) => {
    //   this.isOpenNotes = value();
    // });
    this.isOpenNotes = false;
    if (this.ticketID) {
      this.ticketService
        .addViewTicketHistory(this.userID, this.ticketID)
        .subscribe();
    }
    // this.baseIconsPath = ConstPath.baseIconsPath;
    this.arrowSvg = ConstPath.ARROW_LEFT;
  }

  back() {
    // dispatcher
    this._router.navigate(['home']);
  }

  initTitle(link:any) {
    this.title = link.name;
    if (this.title == 'פרטי דוח') {
      this.title = '';
    }
  }
}
