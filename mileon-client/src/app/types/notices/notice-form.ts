import { Validators } from '@angular/forms';
import { Data } from '@angular/router';
import { Patterns } from 'src/app/validators/validationPatterns';

export class NoticeForm {
  noticeMessageOptionId: number;
  startDate: Date;
  endDate: Date;
  ticketTypeID: number;
  seriesNumber: number;
  violationIDs: string[];
  violationTypeIds: string[];
  ticketSourceID: number[];
  ticketStageID: number;
  inspectorName: string;
  cityID: number[];
  cityStreetID: number[];
  ticketNumber: string;
  //NOTE - Add  מזהה לייצוא,
  noticeType: string;
  populationType: string;
  legalRequests: boolean;
  dateFrom: Date;
  dateTo: Date;
  fromPaymentBalance: number;
  toPaymentBalance: number;
  postStatus: string;
  sendDate: Date;
  //אופן ההפקה
  //NOTE - לא צריך להיות כאן -
  messageType: string;
  engraving: string;
  sendingType: string;
  dayToPay: number;
  ticketsWithPictures: boolean;
  numberOfPictures: number;
  additionalFee: string;
  debatorMail: boolean;

  noticeDateFrom: Date;
  noticeDateTo: Date;
  noticeBy: string;
  constructor(noticeFormFields: NoticeForm) {
    this.noticeMessageOptionId = noticeFormFields.noticeMessageOptionId;
    this.startDate = noticeFormFields.startDate;
    this.endDate = noticeFormFields.endDate;
    this.ticketTypeID = noticeFormFields.ticketTypeID;
    this.seriesNumber = noticeFormFields.seriesNumber;
    this.violationIDs = noticeFormFields.violationIDs;
    this.violationTypeIds = noticeFormFields.violationTypeIds;
    this.ticketSourceID = noticeFormFields.ticketSourceID;
    this.ticketStageID = noticeFormFields.ticketStageID;
    this.inspectorName = noticeFormFields.inspectorName;
    this.cityID = noticeFormFields.cityID;
    this.cityStreetID = noticeFormFields.cityStreetID;
    this.ticketNumber = noticeFormFields.ticketNumber;

    //NOTE - Add  מזהה לייצוא, סוג אוכלוסייה, בקשות להשפט
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
    this.engraving = noticeFormFields.engraving;
    this.sendingType = noticeFormFields.sendingType;
    this.dayToPay = noticeFormFields.dayToPay;
    this.ticketsWithPictures = noticeFormFields.ticketsWithPictures;
    this.numberOfPictures = noticeFormFields.numberOfPictures;
    //?
    this.additionalFee = noticeFormFields.additionalFee;
    this.debatorMail = noticeFormFields.debatorMail;

    //manage
    this.noticeDateFrom = noticeFormFields.noticeDateFrom;
    this.noticeDateTo = noticeFormFields.noticeDateTo;
    this.noticeBy = noticeFormFields.noticeBy;
  }

  static validators = {
    // startDate: [
    //FIXME -  this Patterns.DATE_YYYYMMDD not works
    //   Validators.pattern(Patterns.DATE_YYYYMMDD),
    //   Validators.required,
    // ],
    // endDate: [Validators.pattern(Patterns.DATE_YYYYMMDD)],
    startDate: [
      // Validators.pattern(Patterns.DATE_YYYYMMDD),
      Validators.required,
    ],
    // endDate: [Validators.pattern(Patterns.DATE_YYYYMMDD)],
    ticketTypeID: [Validators.required],
    noticeType: [Validators.required],
    //NOTE - add this
    // sendDate: [Validators.pattern(Patterns.DATE_YYYYMMDD), Validators.required], //NOTE: שישי שבת צריך להחסם
    // messageType: [Validators.required],
    // sendingType: [Validators.required],
    // dayToPay: [Validators.pattern('^[0-9]*$')], //Auto
    // ticketsWithPictures: [Validators.required],
    // numberOfPictures: [Validators.pattern('^[0-9]*$')],
    ticketNumber: [Validators.pattern('^[0-9]*$')],
  };
}

export const noticeValidation = {
  startDate: [Validators.required],
  // endDate: [Validators.pattern(Patterns.DATE_DDMMYYYY)],
  ticketTypeID: [Validators.required],
  // ticketNumber: [Validators.pattern('^[0-9]*$')],
  noticeType: [Validators.required],
  // sendDate: [Validators.pattern(Patterns.DATE_DDMMYYYY), Validators.required], //NOTE: שישי שבת צריך להחסם
  // messageType: [Validators.required],
  // sendingType: [Validators.required],
  // dayToPay: [Validators.pattern('^[0-9]*$')], //Auto
  // ticketsWithPictures: [Validators.required],
  // numberOfPictures: [Validators.pattern('^[0-9]*$')],
};
