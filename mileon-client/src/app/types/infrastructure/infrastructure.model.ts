import { ConstPath as Icons } from '../../constants/const_path';
import { ModuleNames, SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';
import { ROUTE_PATH } from '../../constants/routerPath';

export class InfrastructureMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.Type,
      url: `${ROUTE_PATH.Infrastructure.VehiclesType}`,
      name: 'vehicleTypes',
    },
    {
      disabled: null,
      text: SubModuleNames.Color,
      url: `${ROUTE_PATH.Infrastructure.VehiclesColors}`,
      name: 'vehicleColors',
    },
    {
      disabled: null,
      text: SubModuleNames.Manufacture,
      url: `${ROUTE_PATH.Infrastructure.VehiclesManufacture}`,
      name: 'vehicleManufacturer',
    },
  ];
}
