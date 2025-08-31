import { Permission } from './../permission.interface';
import { ROUTE_PATH } from '../../constants/routerPath';
import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';

export class PermissionsMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.UserRoutes,
      url: `${ROUTE_PATH.UsersPermissions.UserRoutes}`,
      name: 'userSettings',
      id: '1',
    },
    {
      disabled: null,
      text: SubModuleNames.AdminRoutes,
      url: `${ROUTE_PATH.UsersPermissions.AdminRoutes}`,
      name: 'adminSettings',
      id: '2',
    },
  ];
}
