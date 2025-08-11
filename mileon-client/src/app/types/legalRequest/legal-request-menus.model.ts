import {SideMenu} from "../base/menu.model";
import {ROUTE_PATH} from "../../constants/routerPath";
import { PermissionRoutes } from "src/app/constants/permissions.enum";

export class LegalRequestMenus {
  public static LegalRequestSideMenu: SideMenu = {
    name: 'LegalRequestSideMenu',
    menuItems: [
      {
        id: '1',
        path: ROUTE_PATH.LegalRequests.Details,
        displayName: 'פרטי בקשה',
        icon: '../../../../../../assets/icons/profile.svg',
        route: ROUTE_PATH.LegalRequests.Details,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
        ],
      },
      {
        id: '1',
        path: '',
        displayName: 'קבצים',
        icon: '../../../../../../assets/icons/file-menu-icon.svg',
        route: ROUTE_PATH.LegalRequests.RequestDocuments,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
          PermissionRoutes.LEGAL_REQUEST_UPLOAD_FILE
        ]
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.Details,
        displayName: 'פרטי דו"ח',
        icon: '../../../../../../assets/icons/ticket-details.svg',
        route: ROUTE_PATH.LegalRequests.TicketDetails,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.CALL_SUMMARY
        ]
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.History,
        displayName: 'היסטוריה',
        icon: '../../../../../../assets/icons/history.svg',
        route: ROUTE_PATH.TicketsNew.History,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        permissionRoutes: [
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.TICKETS_HISTORY,
          PermissionRoutes.TICKET_LOOKUP
        ],
      },
    ],
  };
}
