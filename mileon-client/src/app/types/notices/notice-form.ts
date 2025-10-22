import { Validators } from '@angular/forms';
import { forbiddenWeekdaysValidator } from '../../validators/weekend-validator'; 

export class NoticeForm {
  noticeMessageOptionId: number;
  startDate: Date;
  endDate: Date;
  ticketTypeID: number;
  seriesNumbers: number[];
  violationIDs: string[];
  violationTypeIds: string[];
  ticketSourceID: number[];
  ticketStageID: number;
  ticketStatusID: number;
  inspectorName: string;
  cityID: number[];
  cityStreetID: number[];
  ticketNumber: string;

  noticeType: string;
  populationType: string;
  legalRequests: boolean;
  dateFrom: Date;
  dateTo: Date;
  fromPaymentBalance: number;
  toPaymentBalance: number;
  postStatus: string;
  sendDate: Date;

  messageType: string;
  isCombined: boolean;
  // engraving: string;
  sendingType: string;
  dayToPay: number;
  ticketsWithPictures: boolean;
  numberOfPictures: number;
  additionalFee: string;
  debatorMail: boolean;

  isCNChecked: boolean;
  determiningDateFrom: Date;
  determiningDateTo: Date;
  cratedBy: string;
  templateId: string;
  userId: string;
  authorityID: string;
  isTriedRequestChecked: boolean;
  fromFeeBalance: number;
  toFeeBalance: number;
  fromDate: Date;
  toDate: Date;
  inspectorIDs: string[];
  constructor(noticeFormFields: NoticeForm) {
    this.noticeMessageOptionId = noticeFormFields.noticeMessageOptionId;
    this.startDate = noticeFormFields.startDate;
    this.endDate = noticeFormFields.endDate;
    this.ticketTypeID = noticeFormFields.ticketTypeID;
    this.seriesNumbers = noticeFormFields.seriesNumbers;
    this.violationIDs = noticeFormFields.violationIDs;
    this.violationTypeIds = noticeFormFields.violationTypeIds;
    this.ticketSourceID = noticeFormFields.ticketSourceID;
    this.ticketStageID = noticeFormFields.ticketStageID;
    this.ticketStatusID = noticeFormFields.ticketStatusID;
    this.inspectorName = noticeFormFields.inspectorName;
    this.cityID = noticeFormFields.cityID;
    this.cityStreetID = noticeFormFields.cityStreetID;
    this.ticketNumber = noticeFormFields.ticketNumber;

    this.isCNChecked = noticeFormFields.isCNChecked;
    this.noticeType = noticeFormFields.noticeType;
    this.populationType = noticeFormFields.populationType;
    this.legalRequests = noticeFormFields.legalRequests;
    this.dateFrom = noticeFormFields.dateFrom;
    this.dateTo = noticeFormFields.dateTo;
    this.fromPaymentBalance = noticeFormFields.fromPaymentBalance;
    this.toPaymentBalance = noticeFormFields.toPaymentBalance;
    this.postStatus = noticeFormFields.postStatus;
    this.sendDate = noticeFormFields.sendDate;
    this.messageType = noticeFormFields.messageType;
    this.sendingType = noticeFormFields.sendingType;
    this.dayToPay = noticeFormFields.dayToPay;
    this.ticketsWithPictures = noticeFormFields.ticketsWithPictures;
    this.numberOfPictures = noticeFormFields.numberOfPictures;

    this.additionalFee = noticeFormFields.additionalFee;
    this.debatorMail = noticeFormFields.debatorMail;
    this.isTriedRequestChecked = noticeFormFields.isTriedRequestChecked;
    this.fromFeeBalance = noticeFormFields.fromFeeBalance;
    this.toFeeBalance = noticeFormFields.toFeeBalance;
    //manage
    this.determiningDateFrom = noticeFormFields.determiningDateFrom;
    this.determiningDateTo = noticeFormFields.determiningDateTo;
    this.cratedBy = noticeFormFields.cratedBy;
    this.authorityID = noticeFormFields.authorityID;
    this.userId = noticeFormFields.userId;
    this.templateId = noticeFormFields.templateId;
    this.fromDate = noticeFormFields.fromDate;
    this.toDate = noticeFormFields.toDate;
    this.inspectorIDs = noticeFormFields.inspectorIDs;
    this.isCombined = noticeFormFields.isCombined;
  }

  // static validators = {
  //   // startDate: [
  //   //FIXME -  this Patterns.DATE_YYYYMMDD not works
  //   //   Validators.pattern(Patterns.DATE_YYYYMMDD),
  //   //   Validators.required,
  //   // ],
  //   // endDate: [Validators.pattern(Patterns.DATE_YYYYMMDD)],
  //   startDate: [
  //     // Validators.pattern(Patterns.DATE_YYYYMMDD),
  //     Validators.required,
  //   ],
  //   // endDate: [Validators.pattern(Patterns.DATE_YYYYMMDD)],
  //   ticketTypeID: [Validators.required],
  //   noticeType: [Validators.required],
  //   //sendingType: [Validators.required],
  //   //NOTE - add this
  //   // Validators.pattern(Patterns.DATE_YYYYMMDD),
  //   sendDate: [Validators.required], //NOTE: שישי שבת צריך להחסם
  //   messageType: [Validators.required],
  //   sendingType: [Validators.required],
  //   dayToPay: [Validators.pattern('^[0-9]*$')], //Auto
  //   // ticketsWithPictures: [Validators.required],
  //   // numberOfPictures: [Validators.pattern('^[0-9]*$')],
  //   // ticketNumber: [Validators.pattern('^[0-9]*$')],
  // };
}

export const noticeValidation = {
  startDate: [Validators.required],
  // endDate: [Validators.pattern(Patterns.DATE_DDMMYYYY)],
  ticketTypeID: [Validators.required],
  // ticketNumber: [Validators.pattern('^[0-9]*$')],
  noticeType: [Validators.required],
  sendDate: [Validators.required, forbiddenWeekdaysValidator([5, 6])],
  fromPaymentBalance:[Validators.pattern('^[0-9]*$')],
  toPaymentBalance:[Validators.pattern('^[0-9]*$')],
  fromFeeBalance:[Validators.pattern('^[0-9]*$')],
  toFeeBalance:[Validators.pattern('^[0-9]*$')],
  // sendDate: [Validators.pattern(Patterns.DATE_DDMMYYYY), Validators.required], //NOTE: שישי שבת צריך להחסם
  // messageType: [Validators.required],
  sendingType: [Validators.required],
  isCombined: [Validators.required],
  // determiningDateFrom: [Validators.required],
  // fromPaymentBalance:[Validators.required]
  // dayToPay: [Validators.pattern('^[0-9]*$')], //Auto
  // ticketsWithPictures: [Validators.required],
  // numberOfPictures: [Validators.pattern('^[0-9]*$')],
};
