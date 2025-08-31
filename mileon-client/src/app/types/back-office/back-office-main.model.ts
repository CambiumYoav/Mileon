import { ConstPath as Icons } from '../../constants/const_path';
import { ModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';
import { ROUTE_PATH } from '../../constants/routerPath';
import { PermissionRoutes } from '../../constants/permissions.enum';

export class BackOfficeMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: true,
      text: ModuleNames.TicketsNewModule,
      imgSrc: Icons.TICKETS,
      url: `${ROUTE_PATH.TicketsNew.Home}/${ROUTE_PATH.TicketsNew.Main}`,
      name: 'ticketsTotal',
      permissionRoutes: [
        PermissionRoutes.TICKETS_SUMMARY,
        PermissionRoutes.TICKETS_SUMMARY_LIST,
        PermissionRoutes.USER_SUMMARY_TOTAL,
      ],
    },
    {
      disabled: true,
      text: ModuleNames.ParkingPermitsModule,
      imgSrc: Icons.PARKINGPERMITS,
      url: `${ROUTE_PATH.ParkingPermits.Home}/${ROUTE_PATH.ParkingPermits.Main}`,
      name: 'parkingPermitsTotal',
      permissionRoutes: [
        PermissionRoutes.PARKING_PERMIT_SUMMARY,
        PermissionRoutes.PARKING_PERMIT_SUMMARY_LIST,
        PermissionRoutes.USER_SUMMARY_TOTAL,
      ],
    },
    {
      disabled: true,
      text: ModuleNames.LegalRequestsModule,
      imgSrc: Icons.BANK,
      url: `${ROUTE_PATH.LegalRequests.Home}/${ROUTE_PATH.LegalRequests.Main}`,
      name: 'legalRequestsTotal',
      permissionRoutes: [
        PermissionRoutes.LEGAL_REQUEST_SUMMARY,
        PermissionRoutes.LEGAL_REQUEST_SUMMARY_LIST,
        PermissionRoutes.USER_SUMMARY_TOTAL,
      ],
    },
  ];
}
