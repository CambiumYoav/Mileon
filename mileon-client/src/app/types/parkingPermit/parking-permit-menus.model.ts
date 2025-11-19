import { ROUTE_PATH } from '../../constants/routerPath';
import { SideMenu } from '../base/menu.model';
import { PermissionRoutes } from '../../constants/permissions.enum';

export class ParkingPermitMenus {
  public static parkingPermitDefaultTitle = 'חיפוש עבור תווי דייר';
  public static ParkingPermitSideMenu: SideMenu = {
    name: 'ParkingPermitSideMenu',
    menuItems: [
      {
        id: '1',
        path: ROUTE_PATH.ParkingPermits.Details,
        displayName: 'צפייה בתו דייר',
        icon: '../../../../../../assets/icons/eye.svg',
        route: ROUTE_PATH.ParkingPermits.Details,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [PermissionRoutes.PARKING_PERMIT_BY_ID],
      },
      {
        id: '1',
        path: ROUTE_PATH.ParkingPermits.RequestDocuments,
        displayName: 'מסמכי בקשה',
        icon: '../../../../../../assets/icons/ticket_status.svg',
        route: ROUTE_PATH.ParkingPermits.RequestDocuments,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
          PermissionRoutes.PARKING_PERMIT_BY_ID,
          PermissionRoutes.PARKING_PERMIT_BY_ID_FILES,
        ],
      },
    ],
  };
  // public static ParkingPermitTypesSideMenu: SideMenu = {
  //   name: 'ParkingPermitTypesSideMenu',
  //   menuItems: [
  //     {
  //       id: '1',
  //       path: `${ROUTE_PATH.ParkingPermits.Blank}/${ROUTE_PATH.ParkingPermits.TypesMain}/${ROUTE_PATH.ParkingPermits.Types}`,
  //       displayName: 'ניהול הגדרות סוגי תווים',
  //       icon: '../../../../../../assets/icons/eye.svg',
  //       route: `${ROUTE_PATH.ParkingPermits.Blank}/${ROUTE_PATH.ParkingPermits.TypesMain}/${ROUTE_PATH.ParkingPermits.Types}`,
  //       color: '#FFFFFF',
  //       bgColor: '#00ff00',
  //       permissionRoutes: [PermissionRoutes.PARKING_PERMIT_BY_ID],
  //     },
  //     {
  //       id: '2',
  //       path: `${ROUTE_PATH.ParkingPermits.Blank}/${ROUTE_PATH.ParkingPermits.TypesMain}/${ROUTE_PATH.ParkingPermits.TypesManagement}`,
  //       // path: ROUTE_PATH.ParkingPermits.TypesManagement,
  //       displayName: 'הגדרות תווים',
  //       icon: '../../../../../../assets/icons/ticket_status.svg',
  //       // route: ROUTE_PATH.ParkingPermits.TypesManagement,
  //       route: `${ROUTE_PATH.ParkingPermits.Blank}/${ROUTE_PATH.ParkingPermits.TypesMain}/${ROUTE_PATH.ParkingPermits.TypesManagement}`,
  //       color: '#FFFFFF',
  //       bgColor: '#00ff00',
  //       permissionRoutes: [
  //         PermissionRoutes.PARKING_PERMIT_BY_ID,
  //         PermissionRoutes.PARKING_PERMIT_BY_ID_FILES,
  //       ],
  //     },
  //   ],
  // };
  public static ParkingPermitTypesSideMenu: SideMenu = {
    name: 'ParkingPermitTypesSideMenu',
    menuItems: [
      {
        id: '1',
        // משמש רק ל-includes לזיהוי ה־selected
        path: ROUTE_PATH.ParkingPermits.Types, // 'types'
        displayName: 'ניהול הגדרות סוגי תווים',
        icon: '../../../../../../assets/icons/eye.svg',
        // זה מה שנשתמש בו לניווט יחסי
        route: ROUTE_PATH.ParkingPermits.Types, // 'types'
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [PermissionRoutes.PARKING_PERMIT_BY_ID],
      },
      {
        id: '2',
        path: ROUTE_PATH.ParkingPermits.TypesManagement, // 'permits-types'
        displayName: 'הגדרות תווים',
        icon: '../../../../../../assets/icons/ticket_status.svg',
        route: ROUTE_PATH.ParkingPermits.TypesManagement, // 'permits-types'
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
          PermissionRoutes.PARKING_PERMIT_BY_ID,
          PermissionRoutes.PARKING_PERMIT_BY_ID_FILES,
        ],
      },
    ],
  };
  
}
