import { ActionButtonNames } from '../../constants/action_buttons';

export class ParkingPermitsButtonsModel {
  public static DispatcherActionButtons: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    // 'PrintToPDF',
    'RenewParkingPermits',
    'ExportToExcel',
    'ImportFromExcel',
  ];
  public static BackOfficeActionButtons: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
    'Create',
    'RenewParkingPermits',
    'ExportToExcel',
    'ImportFromExcel',
  ];
}
