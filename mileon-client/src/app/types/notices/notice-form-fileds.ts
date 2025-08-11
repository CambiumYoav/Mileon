import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';

//FIXME - update all the names from the server
export const noticesFields: Field[] = [
  // Group fields for a single row
  {
    name: 'startDate',
    displayName: 'תאריך עבירה מ',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'endDate',
    displayName: 'תאריך עבירה עד',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'ticketTypeID',
    displayName: 'סוג דוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketTypes',
    },
  },
  {
    name: 'seriesNumber',
    displayName: 'סידרת דוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketSeries',
    },
  },
  {
    name: 'violationIDs',
    displayName: 'סעיף עבירה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    bindLabelKeys: ['section', 'description'],
    dataFunction: {
      name: 'getViolationDetailsList',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityIDs',
        },
      ],
    },
  },
  {
    name: 'violationTypeIds',
    displayName: 'סוגי עבירות',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    // bindLabelKeys: ['section', 'description'],
    dataFunction: {
      // name: 'getViolationDetailsList',
      // extraParams: [
      //   {
      //     connectedField: 'authorityID',
      //     paramName: 'authorityIDs',
      //   },
      // ],
      name: 'getViolationTypesList',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityIDs',
        },
      ],
    },
  },
  {
    name: 'ticketSourceID',
    displayName: 'מקור דוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketResources',
    },
  },
  // {
  //   name: 'statusID',
  //   displayName: 'סטטוס דוח',
  //   type: FieldTypeEnum.Select,
  //   length: FieldLengthEnum.Long,
  //   dataFunction: {
  //     name: 'getTicketLookups',
  //     objName: 'ticketStatuses',
  //   },
  // },

  {
    name: 'ticketStageID',
    displayName: 'שלב דוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups', //ticketStages
      objName: 'ticketStages',
    },
  },
  {
    name: 'inspectorName',
    displayName: 'שם פקח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getInspectors',
    },
  },
  {
    name: 'cityID',
    displayName: 'בחירת ישובים',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    //FIXME - should be cites by the authority id 
    dataFunction: {
      name: 'getCities',

      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityIDs',
        },
      ],
    },
  },
  {
    name: 'cityStreetID',
    displayName: 'בחירת רחוב עבירה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getStreets',
      extraParams: [
        {
          connectedField: 'cityID',
          paramName: 'cityIDs',
        },
      ],
    },
  },
  {
    name: 'ticketNumber',
    displayName: 'מספר דוח',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'populationType',
    displayName: 'מזהה לייצוא',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'populationType',
    displayName: 'סוג אוכלוסיה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPopulation',
    },
  },
  {
    name: 'legalRequests',
    displayName: 'בקשות להישפט',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getYesNoOptions',
    },
  },
  {
    name: 'dateFrom',
    displayName: 'תאריך קובע מ-',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'dateFrom',
    displayName: 'תאריך קובע עד',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'fromPaymentBalance',
    displayName: 'יתרה לתשלום מ-',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'toPaymentBalance',
    displayName: 'יתרה לתשלום עד-',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'postStatus',
    displayName: 'סטטוס דואר הודעת תשלום',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
  },
];

//FIXME - update all the names from the server
export const noticeOptionFields: Field[] = [
  {
    name: 'noticeType',
    displayName: 'אופן ההפקה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingTypes',
    },
  },
  {
    name: 'engraving',
    displayName: 'בחירת גלופה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingBoard',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityIDs',
        },
        {
          connectedField: 'noticeMessageOptionId',
          paramName: 'noticeMessageOptionId',
        },
      ],
    },
  },
  {
    name: 'sendDate',
    displayName: 'תאריך משלוח הודעה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'messageType',
    displayName: 'סוג הודעה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'sendingType',
    displayName: 'סוג משלוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'dayToPay',
    displayName: 'ימים לתשלום',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'ticketsWithPictures',
    displayName: 'לכלול דוחות רק עם תמונות?',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getYesNoOptions',
    },
  },
  {
    name: 'numberOfPictures',
    displayName: 'מספר תמונות בדוח',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'additionalFee',
    displayName: 'תוספת אגרה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },

  {
    name: 'debatorMail',
    displayName: 'שליחת מייל לחייב',
    type: FieldTypeEnum.Checkbox,
    length: FieldLengthEnum.Long,
  },
];

export const noticeSearchFields: Field[] = [
  {
    name: 'noticeType',
    displayName: 'סוג הודעה להפקה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingTypes',
    },
  },
  {
    name: 'ticketNumber',
    displayName: 'מתאריך הפקה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'sendDate',
    displayName: 'עד תאריך הפקה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'ticketNumber',
    displayName: 'מספר דוח',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'sendingType',
    displayName: 'הופק ע"י',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
  },
];
