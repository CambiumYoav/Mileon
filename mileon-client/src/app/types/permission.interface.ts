import { RoleEnum } from './enum/moduleEnum';
import { FilterOptions } from './filters/filterOptions';

export interface Permission {
  modules: Module[];
  options: Options;
  active: boolean;
}

export interface Route {
  id: string;
  path: string;
  isRead: boolean;
}

export interface Module {
  id: string;
  name: string;
  // routes: Route[];
  route: Route;
}

export interface Options {
  canRemoveBankLien: boolean;
  canQueryTransportationMinistry: boolean;
}

export type FullPermission = Permission & {
  role: string;
};

export type TokenWithPermission = {
  token: string;
  permissions: Permission;
};

export class PermissionsFilterOptions extends FilterOptions {
  route?: Route;
  constructor(args: PermissionsFilterOptions) {
    super();
    this.route = args.route;
  }
}
