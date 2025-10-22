import { Validators } from '@angular/forms';
import { ModuleEnum } from '../enum/moduleEnum';
import { Patterns } from '../../validators/validationPatterns'; 

export class ConfigForm {
  module: ModuleEnum;
  costumerNumber: number;
  serviceNumber: number;
  requestedData: string;
  subServiceNumber: number;
  batch: number;
  sendingFileDate: Date;
  referenceForm: any; //FIXME: update type
  customerServiceAuthId: string;
  firstFreeField: string;
  secondFreeField: string;
  thirdFreeField: string;
  fourthFreeField: string;
  fifthFreeField: string;

  constructor(configFormFields: ConfigForm) {
    this.module = configFormFields.module;
    this.costumerNumber = configFormFields.costumerNumber;
    this.serviceNumber = configFormFields.serviceNumber;
    this.requestedData = configFormFields.requestedData;
    this.subServiceNumber = configFormFields.subServiceNumber;
    this.batch = configFormFields.batch;
    this.sendingFileDate = configFormFields.sendingFileDate;
    this.referenceForm = configFormFields.referenceForm;
    this.customerServiceAuthId = configFormFields.customerServiceAuthId;
    this.firstFreeField = configFormFields.firstFreeField;
    this.secondFreeField = configFormFields.secondFreeField;
    this.thirdFreeField = configFormFields.thirdFreeField;
    this.fourthFreeField = configFormFields.fourthFreeField;
    this.fifthFreeField = configFormFields.fifthFreeField;
  }

  static validators = {
    costumerNumber: [Validators.pattern('^[0-9]{1,6}$'), Validators.required],
    serviceNumber: [Validators.pattern('^[0-9]{1,6}$'), Validators.required],
    requestedData: [
      Validators.pattern(/^[a-zA-Z0-9.]{1,200}$/),
      Validators.required,
    ],
    subServiceNumber: [Validators.pattern('^[0-9]{1,8}$'), Validators.required],
    batch: [Validators.pattern('^[0-9]$'), Validators.required],
    sendingFileDate: [
      Validators.pattern(Patterns.DATE_YYYYMMDD),
      Validators.required,
    ],
    referenceForm: [
      Validators.pattern(/^[a-zA-Z0-9.]{1,20}$/),
      Validators.required,
    ],
    customerServiceAuthId: [
      Validators.pattern(/^[a-zA-Z0-9.]{1,20}$/),
      Validators.required,
    ],
    firstFreeField: [Validators.pattern(/^[a-zA-Z0-9.]{0,10}$/)],
    secondFreeField: [Validators.pattern(/^[a-zA-Z0-9.]{0,10}$/)],
    thirdFreeField: [Validators.pattern(/^[a-zA-Z0-9.]{0,10}$/)],
    fourthFreeField: [Validators.pattern(/^[a-zA-Z0-9.]{0,10}$/)],
    fifthFreeField: [Validators.pattern(/^[a-zA-Z0-9.]{0,10}$/)],
  };
}
