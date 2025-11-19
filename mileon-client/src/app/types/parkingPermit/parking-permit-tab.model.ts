
import { ROUTE_PATH } from '../../constants/routerPath';
import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';

export class ParkingPermitsMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.ParkingPermitsTypesSettings,
      url: `${ROUTE_PATH.ParkingPermits.PermitsTypesSettings}`,
      name: 'parkingPermitsTypesSettings',
      id: '1',
    },
    {
      disabled: null,
      text: SubModuleNames.ParkingPermitsTypesDocumnents,
      url: `${ROUTE_PATH.ParkingPermits.PermitsTypesDocumnents}`,
      name: 'parkingPermitsTypesDocumnets',
      id: '2',
    },
  ];
}
