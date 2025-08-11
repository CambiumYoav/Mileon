import { Params } from '@angular/router';

export interface Menu {
  name: string;
  menuItems: MenuItem[];
}

export interface SideMenu {
  name: string;
  menuItems: SideMenuItem[];
}

export interface SideMenuItem extends MenuItem {
  color: string;
  bgColor: string;
  disabled?: boolean;
  permissionRoutes?: string[];
}

export interface MenuItem {
  id: string;
  path: string;
  displayName: string;
  icon?: string;
  route: string;
  expanded?: boolean;
  state?: Record<string, any>;
  queryParams?: Params[];
  menuItems?: MenuItem[];
  permissionRoute?: string[];
  showItem?: boolean;
  subDisplayName?: string;
  active?: boolean;
}
