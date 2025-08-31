import { ticketFileTypes } from '../../constants/ticketFileTypes';
import { FieldLengthEnum, FieldTypeEnum } from '../advanced-search/form-tab.model';
import { ActionDialog } from './sendEmailDialogOptions';
import {parkingPermitFileTypes} from "../../constants/parkingPermitFileTypes";
import {ModuleEnum} from "../enum/moduleEnum";

export class PrintPdfDialogForm {
    fileTypes: number[];

    constructor(printPdfDialogForm: PrintPdfDialogForm) {
        this.fileTypes = printPdfDialogForm.fileTypes;
    }
}

export class PrintPdfDialogFields {
  public static getPrintPdfDialogFields(moduleEnum: ModuleEnum): ActionDialog {
    let optionsForFileTypes;

    switch (moduleEnum) {
      case ModuleEnum.ParkingPermitsModule:
        optionsForFileTypes = parkingPermitFileTypes;
        break;
      // You can add more cases here in the future.
      default:
        optionsForFileTypes = ticketFileTypes;
    }

    return {
      title: 'מסמכים להדפסה',
      fields: [
        {
          name: 'fileTypes',
          displayName: 'כל המסמכים',
          type: FieldTypeEnum.CheckboxGroup,
          length: FieldLengthEnum.Medium,
          options: optionsForFileTypes,
        }
      ]
    };
  }

  public static getIds() {
    return ticketFileTypes.map(fileType => fileType.id);
  }
}
