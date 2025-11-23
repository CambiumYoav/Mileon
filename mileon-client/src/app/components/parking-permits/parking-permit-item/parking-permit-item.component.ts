import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../../shared/base/menu/side-menu/side-menu.component';
import { AuthorityService } from '../../../services/authority.service ';
import { SideMenu } from '../../../types/base/menu.model';
import { ParkingPermitMenus } from '../../../types/parkingPermit/parking-permit-menus.model';

@Component({
  selector: 'app-parking-permit-item',
  imports: [RouterOutlet, SideMenuComponent],
  templateUrl: './parking-permit-item.component.html',
  styleUrl: './parking-permit-item.component.scss',
})
export class ParkingPermitItemComponent {
  parkingPermitId: string = '';

  menu: SideMenu = ParkingPermitMenus.ParkingPermitSideMenu;
  private authorityService = inject(AuthorityService);

  constructor() {}

  ngOnInit(): void {
    this.authorityService.setMunicipalsToNationalRegional();
  }
}
