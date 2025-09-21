import { SubModuleNames } from '../enum/moduleEnum';
import { TabAttributes } from '../filters/tabsGroup';
import { ROUTE_PATH } from '../../constants/routerPath';

/**
 * Terminal-specific shared enums and constants
 * Following Angular 19 patterns for module organization
 */

export enum TerminalModuleEnum {
  TerminalModule = 'TerminalModule',
}

export enum TerminalSubModuleNames {
  GeneralSettings = SubModuleNames.GeneralSettings,
  ExternalInterfaceSettings = SubModuleNames.ExternalInterfaceSettings,
  LegalityByTypeOfOffenseSettings = SubModuleNames.LegalityByTypeOfOffenseSettings,
  IconsToViolationSettings = SubModuleNames.IconsToViolationSettings,
  StatisticsPieTitle = SubModuleNames.StatisticsPieTitle,
  StatisticsLineTitle = SubModuleNames.StatisticsLineTitle,
  StatisticsBarTitle = SubModuleNames.StatisticsBarTitle,
  StatisticsTableTitle = SubModuleNames.StatisticsTableTitle,
}


export enum TerminalTabNames {
  GeneralSettings = 'generalSettings',
  ExternalInterfaceSettings = 'externalInterfaceSettings',
  LegalityByTypeOfOffenseSettings = 'legalityByTypeOfOffenseSettings',
  IconsToViolationSettings = 'iconsToViolationSettings',
  StatisticsPie = 'statisticsPie',
  StatisticsLine = 'statisticsLine',
  StatisticsBar = 'statisticsBar',
  StatisticsTable = 'statisticsTable',
}

export enum TerminalErrorsMessages {
  REQUIRED_FIELD = 'שדה זה נדרש',
  MIN_LENGTH = 'מינימום תווים',
  MAX_LENGTH = 'מקסימום תווים',
  PATTERN = 'פורמט לא תקין',
  MIN = 'ערך מינימלי',
  MAX = 'ערך מקסימלי',
  CHARACTERS = 'תווים',
  
}

export enum TerminalInitialDescription {
  TICKET_BOOKS_ASSIGNED = 'סדרת פנקס,מספר פנקס,שם פקח,תאריך קליטה,מדוח,עד דוח,סה"כ דוחות,דוחות פתוחים',
}

export class TerminalSharedConfig {
  public static readonly SettingsTabs: TabAttributes[] = [
    {
      disabled: null,
      text: TerminalSubModuleNames.GeneralSettings,
      url: `${ROUTE_PATH.Terminal.GeneralSetings}`,
      name: TerminalTabNames.GeneralSettings,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.ExternalInterfaceSettings,
      url: `${ROUTE_PATH.Terminal.ExternalInterfaceSettings}`,
      name: TerminalTabNames.ExternalInterfaceSettings,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.LegalityByTypeOfOffenseSettings,
      url: `${ROUTE_PATH.Terminal.LegalityByTypeOfOffenseSettings}`,
      name: TerminalTabNames.LegalityByTypeOfOffenseSettings,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.IconsToViolationSettings,
      url: `${ROUTE_PATH.Terminal.IconsSettings}`,
      name: TerminalTabNames.IconsToViolationSettings,
    },
  ];

  public static readonly StatisticsTabs: TabAttributes[] = [
    {
      disabled: null,
      text: TerminalSubModuleNames.StatisticsPieTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsPie}`,
      name: TerminalTabNames.StatisticsPie,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.StatisticsLineTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsLine}`,
      name: TerminalTabNames.StatisticsLine,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.StatisticsBarTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsBar}`,
      name: TerminalTabNames.StatisticsBar,
    },
    {
      disabled: null,
      text: TerminalSubModuleNames.StatisticsTableTitle,
      url: `${ROUTE_PATH.Terminal.StatisticsTable}`,
      name: TerminalTabNames.StatisticsTable,
    },
  ];
}

// Type definitions for better type safety
export type TerminalModuleEnumKeys = keyof typeof TerminalModuleEnum;
export type TerminalSubModuleNamesKeys = keyof typeof TerminalSubModuleNames;
export type TerminalTabNamesKeys = keyof typeof TerminalTabNames;
