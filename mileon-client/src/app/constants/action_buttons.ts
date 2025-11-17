export interface ActionAttributes {
  text: string;
  imgSrc: string;
  function?: Function;
  cssClass: string;
  tooltipText: string;
  tooltipClass: string;
  disabled: boolean | null;
  isDisabled?: boolean;
  alwaysEnabled?: boolean;
}

export type ActionButtons = {
  [name in ActionButtonNames]: ActionAttributes;
};

export type ActionButtonNames =
  | 'Payment'
  | 'SendToPhone'
  | 'SendEmail'
  | 'PrintToPDF'
  | 'AddReminder'
  | 'NewRequest'
  | 'Create'
  | 'ClearData'
  | 'ExportTestFile'
  | 'ExportMana'
  | 'ViewMana'
  | 'RestoreMana'
  | 'PostApprove'
  | 'CopyReport'
  | 'RenewParkingPermits'
  | 'ExportToExcel'
  | 'ImportFromExcel';
