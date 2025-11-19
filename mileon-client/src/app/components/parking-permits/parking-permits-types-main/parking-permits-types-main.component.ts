import { ConstPath } from '../../../constants/const_path';
import { AuthorityService } from '../../../services/authority.service ';
import { SideMenu } from '../../../types/base/menu.model';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ParkingPermitMenus } from '../../../types/parkingPermit/parking-permit-menus.model';
import { TicketActionButtonsComponent } from '../../tickets-new/ticket/ticket-action-buttons/ticket-action-buttons.component';
import { SideMenuComponent } from './../../shared/base/menu/side-menu/side-menu.component';
import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-parking-permits-types-main',
  imports: [SideMenuComponent, RouterOutlet],
  template: `<div class="d-flex flex-row h-100">
    <div>
      <app-side-menu [menu]="menu"></app-side-menu>
    </div>
    <div class="container-fluid mt-2 overflow">
      <router-outlet></router-outlet>
    </div>
  </div> `,
})
export class ParkingPermitsTypesMainComponent {
  //ANCHOR -  remove this?
  // @ViewChild('ticketAction') TicketActionButtons!: TicketActionButtonsComponent;
  @ViewChild(SideMenuComponent) SideMenu!: SideMenuComponent;
  readonly title: string = TitlesEnum.ParkingPermitsTypesTitle;
  readonly menu: SideMenu = ParkingPermitMenus.ParkingPermitTypesSideMenu;

  private readonly authorityService = inject(AuthorityService);
  constructor() {}

  ngOnInit(): void {
    this.authorityService.setMunicipalsToNationalRegional();
  }
}
