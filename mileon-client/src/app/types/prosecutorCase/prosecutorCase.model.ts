import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';
import { ROUTE_PATH } from '../../constants/routerPath';

export class ProsecutorCaseMain {
  public static Tabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.RequestCancellation,
      url: `${ROUTE_PATH.ProsecutorCaseSettings.RequestCancellation}`,
      name: 'requestCancellation',
    },
    {
      disabled: null,
      text: SubModuleNames.RequestConversion,
      url: `${ROUTE_PATH.ProsecutorCaseSettings.RequestConversion}`,
      name: 'requestConversion',
    },
    {
      disabled: null,
      text: SubModuleNames.RequestTrial,
      url: `${ROUTE_PATH.ProsecutorCaseSettings.RequestTrial}`,
      name: 'requestTrial',
    },
    {
      disabled: null,
      text: SubModuleNames.DecisionCodeForLetters,
      url: `${ROUTE_PATH.ProsecutorCaseSettings.DecisionCodeForLetters}`,
      name: 'decisionCodeForLetters',
    },
  ];
}
