import { PermissionRoutes } from '../../constants/permissions.enum';
import { ROUTE_PATH } from '../../constants/routerPath';
import { SideMenu } from '../base/menu.model';

export class TicketMenus {
  public static ticketDefaultTitle = 'חיפוש דוחות';
  public static TicketSideMenu: SideMenu = {
    name: 'TicketSideMenu',
    menuItems: [
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.Details,
        displayName: 'פרטי דו"ח',
        icon: '../../../../../../assets/icons/ticket-details.svg',
        route: ROUTE_PATH.TicketsNew.Details,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        disabled: false,
        permissionRoutes: [],
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.Owner,
        displayName: 'בעל העבירה',
        icon: '../../../../../../assets/icons/profile.svg',
        route: ROUTE_PATH.TicketsNew.Owner,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        disabled: false,
        permissionRoutes: [
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.ADD_VIEW_TICKET_HISTORY,
          PermissionRoutes.TICKETS_BY_IDENTITY,
          PermissionRoutes.TICKETS_BY_VEHICLE,
          PermissionRoutes.CITIES,
        ],
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.Violation,
        displayName: 'פרטי העבירה',
        icon: '../../../../../../assets/icons/car.svg',
        route: ROUTE_PATH.TicketsNew.Violation,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        disabled: false,
        permissionRoutes: [
          PermissionRoutes.VIOLATIONS,
          PermissionRoutes.TICKET_LOOKUP,
          PermissionRoutes.TICKET_FINANCIAL_TRANSACTIONS,
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.TICKETS_BY_IDENTITY,
          PermissionRoutes.TICKETS_BY_VEHICLE,
        ],
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.PaymentHistory,
        displayName: 'תנועות כספיות',
        icon: '../../../../../../assets/icons/financial_movements.svg',
        route: ROUTE_PATH.TicketsNew.PaymentHistory,
        color: '#19A58C',
        bgColor: '#D4F8D3',
        disabled: false,
        permissionRoutes: [
          PermissionRoutes.TICKET_FINANCIAL_TRANSACTIONS,
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.TICKETS_BY_IDENTITY,
          PermissionRoutes.TICKETS_BY_VEHICLE,
        ],
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.ConnectedTickets,
        displayName: 'תיקים מקושרים',
        icon: '../../../../../../assets/icons/ticket_online.svg',
        route: ROUTE_PATH.TicketsNew.ConnectedTickets,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        disabled: false,
        permissionRoutes: [
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.TICKETS_BY_IDENTITY,
          PermissionRoutes.TICKETS_BY_VEHICLE,
          PermissionRoutes.TICKET_LOOKUP,
          PermissionRoutes.TICKETS_FINANCIAL_SUMMARY,
        ],
      },
      {
        id: '1',
        path: ROUTE_PATH.TicketsNew.History,
        displayName: 'היסטוריה',
        icon: '../../../../../../assets/icons/history.svg',
        route: ROUTE_PATH.TicketsNew.History,
        color: '#FFFFFF',
        bgColor: '#00ff00',
        disabled: false,
        permissionRoutes: [
          PermissionRoutes.TICKET_LOOKUP,
          PermissionRoutes.TICKETS_DETAILS,
          PermissionRoutes.ADD_VIEW_TICKET_HISTORY,
          PermissionRoutes.TICKETS_HISTORY,
        ],
      },
    ],
  };
}
