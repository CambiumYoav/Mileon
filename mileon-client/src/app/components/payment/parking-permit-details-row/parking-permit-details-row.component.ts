import { Component, inject, input } from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { RouterService } from '../../../services/router.service';
import { ParkingPermitType } from '../../../types/parkingPermit/parkingPermitType';
import {
  isParkingPermitDetails,
  isParkingPermit,
} from '../../../utils/checkParkingPermitType';
import { TagComponent } from '../../shared/base/tag/tag.component';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-parking-permit-details-row',
  imports: [TagComponent,SharedImports],
  templateUrl: './parking-permit-details-row.component.html',
  styleUrl: './parking-permit-details-row.component.scss',
})
export class ParkingPermitDetailsRowComponent {
  private routerService = inject(RouterService);

  permit = input<ParkingPermitType | any>();
  parkingPermitStatus: string = '';
  parkingPermitNumber: string = '';
  parkingPermitTypeName: string = '';
  parkingPermitAuthorityName: string = '';
  parkingPermitCost: number = 0;
  parkingPermitStatusID: number = 0;
  ticketDetailsSvg = ConstPath.TICKET_DETAILS_FILLED;

  constructor() {}

  ngOnInit(): void {
    if (this.permit()) {
      if (isParkingPermitDetails(this.permit()!)) {
        this.parkingPermitStatus = this.permit()!.statusName;
        this.parkingPermitNumber = this.permit()!.parkingPermitID!;
        this.parkingPermitTypeName = this.permit()!.permitTypeName;
        this.parkingPermitAuthorityName = this.permit()!.authorityName;
        this.parkingPermitCost = this.permit()!.cost;
        this.parkingPermitStatusID = this.permit()!.statusId;
      } else if (isParkingPermit(this.permit())) {
        this.parkingPermitNumber = this.permit()!.parkingPermitID;
        this.parkingPermitTypeName = this.permit()!.permitTypeName;
        this.parkingPermitAuthorityName = this.permit()!.authorityName;
        this.parkingPermitCost = this.permit()!.cost;
        this.parkingPermitStatus = this.permit()!.parkingPermitStatus?.name;
        this.parkingPermitStatusID = this.permit()!.parkingPermitStatus?.id;
      }
    }
  }

  openPermitDetails() {
    const baseRoute = ROUTE_PATH.ParkingPermits.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${this.permit()?.parkingPermitID}/${
        ROUTE_PATH.ParkingPermits.Details
      }`
    );
  }
}
