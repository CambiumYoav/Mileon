import { ticketFileTypes } from 'src/app/constants/ticketFileTypes';
import { Field, FieldLengthEnum, FieldTypeEnum } from '../advanced-search/form-tab.model';
import {parkingPermitFileTypes} from "../../constants/parkingPermitFileTypes";
import {ModuleEnum} from "../enum/moduleEnum";
import { Validators } from '@angular/forms';
import { arrayNotEmpty } from 'src/app/validators/baseTypesValidators';

export class SendEmailDialogForm {
    emailAddress: string;
    updateCitizenEmail: boolean;
    fileTypes: [];

    constructor(sendEmailDialogFields: SendEmailDialogForm) {
        this.emailAddress = sendEmailDialogFields.emailAddress;
        this.updateCitizenEmail = sendEmailDialogFields.updateCitizenEmail || false;
        this.fileTypes = sendEmailDialogFields.fileTypes;
    }
    
    static validators = {
      emailAddress: [Validators.email, Validators.required],
      fileTypes: [arrayNotEmpty(), Validators.required],
  };
}

export class ActionDialog {
    title: string;
    fields: Field[];
}

export class SendEmailDialogFields {
  public static getSendEmailDialogFields(moduleEnum: ModuleEnum): ActionDialog {
    let optionsForFileTypes;

    switch (moduleEnum) {
      case ModuleEnum.ParkingPermitsModule:
        optionsForFileTypes = parkingPermitFileTypes;
        break;
      default:
        optionsForFileTypes = ticketFileTypes;
    }

    return {
      title: 'שליחה למייל',
      fields: [
        {
          name: 'emailAddress',
          displayName: 'כתובת מייל',
          type: FieldTypeEnum.Text,
          length: FieldLengthEnum.Medium,
        },
        {
          name: 'updateCitizenEmail',
          displayName: 'עדכן בפרטי התושב',
          type: FieldTypeEnum.Checkbox,
          length: FieldLengthEnum.Medium,
        },
        {
          name: 'fileTypes',
          displayName: 'כל המסמכים',
          type: FieldTypeEnum.CheckboxGroup,
          length: FieldLengthEnum.Medium,
          options: optionsForFileTypes,
        },
      ]
    };
  }

  public static getIds() {
    return ticketFileTypes.map(fileType => fileType.id);
  }
}


