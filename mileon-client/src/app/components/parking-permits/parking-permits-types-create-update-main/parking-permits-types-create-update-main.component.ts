import { Component, inject, signal, ViewChild } from '@angular/core';
import { ParkingPermitTabs } from '../../../types/parkingPermit/parking-permit-tabs.model';
import { Router, RouterOutlet } from '@angular/router';
import { ParkingPermitsTypesTabsComponent } from '../parking-permits-types-tabs/parking-permits-types-tabs.component';
import { ConstPath } from '../../../constants/const_path';
import { AuthorityService } from '../../../services/authority.service ';
import { PermissionService } from '../../../services/permission.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import ParkingPermits = ROUTE_PATH.ParkingPermits;
import { ROUTE_PATH } from '../../../constants/routerPath';

@Component({
  selector: 'app-parking-permits-types-create-update-main',
  imports: [ParkingPermitsTypesTabsComponent, RouterOutlet],

  styleUrl: './parking-permits-types-create-update-main.component.scss',
  template: `<div class="container-lg p-4">
    <div class="row pb-4 align-items-center position-relative">
      <div class="col d-flex justify-content-between align-items-center mb-3">
        <div class="d-flex align-items-center">
          <div class="arrow-container" (click)="back()">
            <img [src]="Icons.ARROW_LEFT" />
          </div>
          @if(isEditMode()){
          <span class="d-flex align-items-center heading ">
            {{ editTitle }}
          </span>
          } @else{
          <span class="d-flex align-items-center heading ">
            {{ title }}
          </span>
          }
        </div>
      </div>
      <app-parking-permits-types-tabs #tabsComponent>
      </app-parking-permits-types-tabs>
    </div>

    <div class="row">
      <router-outlet></router-outlet>
    </div>
  </div> `,
})
export class ParkingPermitsTypesCreateUpdateMainComponent {
  readonly Icons = ConstPath;
  readonly title: string = TitlesEnum.ParkingPermitsTypesCreateTitle;
  readonly editTitle = TitlesEnum.ParkingPermitsTypesUpdateTitle;

  isEditMode = signal<boolean>(false);

  @ViewChild('permitsTypesTabs')
  tabsComponent!: ParkingPermitsTypesTabsComponent;

  private router = inject(Router);
  private permissionsService = inject(PermissionService);
  private authorityService = inject(AuthorityService);

  constructor() {}

  ngOnInit(): void {
    const currentUrl = this.router.url;
    this.isEditMode.set(currentUrl.includes('/edit'));
    this.authorityService.setMunicipalsToNationalRegional();
  }

  back() {
    const role = this.permissionsService.role();
    const parkingPermitsPath = `main/${role}/${ParkingPermits.Home}/${ParkingPermits.TypesMain}/${ParkingPermits.Types}`;
    this.router.navigate([parkingPermitsPath], {}).catch((error) => {
      console.error('Navigation error:', error);
    });
  }
}
