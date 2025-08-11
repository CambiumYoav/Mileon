import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';
import { ROUTE_PATH } from 'src/app/constants/routerPath';

export class TerminalMain {
  //   public static Tabs: TabAttributes[] = [
  //     {
  //       disabled: null,
  //       text: SubModuleNames.GeneralSettings,
  //       url: `${ROUTE_PATH.Terminal.GeneralSetings}`,
  //       name: 'requestCancellation',
  //     },
  //     {
  //       disabled: null,
  //       text: SubModuleNames.ExternalInterfaceSettings,
  //       url: `${ROUTE_PATH.ProsecutorCaseSettings.RequestConversion}`,
  //       name: 'requestConversion',
  //     },
  //     {
  //       disabled: null,
  //       text: SubModuleNames.LegalityByTypeOfOffenseSettings,
  //       url: `${ROUTE_PATH.ProsecutorCaseSettings.RequestTrial}`,
  //       name: 'requestTrial',
  //     },
  //     {
  //       disabled: null,
  //       text: SubModuleNames.IconsToViolationSettings,
  //       url: `${ROUTE_PATH.ProsecutorCaseSettings.DecisionCodeForLetters}`,
  //       name: 'decisionCodeForLetters',
  //     },
  //   ];
  public static SettingsTabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.GeneralSettings,
      url: `${ROUTE_PATH.Terminal.GeneralSetings}`,
      name: 'requestCancellation', //change this
    },
    {
      disabled: null,
      text: SubModuleNames.ExternalInterfaceSettings,
      url: `${ROUTE_PATH.Terminal.ExternalInterfaceSettings}`,
      name: 'requestConversion', //change this
    },
    {
      disabled: null,
      text: SubModuleNames.LegalityByTypeOfOffenseSettings,
      url: `${ROUTE_PATH.Terminal.LegalityByTypeOfOffenseSettings}`,
      name: 'requestTrial', //change this
    },
    {
      disabled: null,
      text: SubModuleNames.IconsToViolationSettings,
      url: `${ROUTE_PATH.Terminal.IconsSettings}`,
      name: 'decisionCodeForLetters', //change this
    },
  ];



  public static StatisticsTabs: TabAttributes[] = [
    {
      disabled: null,
      text: SubModuleNames.StatisticsPieTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsPie}`,
      name: '', 
    },
    {
      disabled: null,
      text: SubModuleNames.StatisticsLineTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsLine}`,
      name: '',
    },
    {
      disabled: null,
      text: SubModuleNames.StatisticsBarTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsBar}`,
      name: '', 
    },
    {
      disabled: null,
      text: SubModuleNames.StatisticsTableTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsTable}`,
      name: '', 
    },
  ];
}
