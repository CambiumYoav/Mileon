import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';
import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicRow } from '../infrastructure/InfrastructureTypes';

export const noticesFields: Field[] = [
  {
    name: 'startDate',
    displayName: 'תאריך עבירה מ',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
    isRequired: true,
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
    isRequired: true,
  },
  {
    name: 'seriesNumbers',
    displayName: 'סידרת דוח',
    multipleSelect: true,
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
    multipleSelect: true,
    // bindLabelKeys: ['section', 'description'],
    dataFunction: {
      name: 'getViolations',
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
    multipleSelect: true,
    dataFunction: {
      name: 'getViolationTypesList',
      objName: 'violationTypes',
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
    multipleSelect: true,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketResources',
    },
  },
  {
    name: 'ticketStatusID',
    displayName: 'סטטוס דוח',
    type: FieldTypeEnum.Select,
    multipleSelect: true,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups',
      objName: 'ticketStatuses',
    },
  },

  {
    name: 'ticketStageID',
    displayName: 'שלב דוח',
    type: FieldTypeEnum.Select,
    multipleSelect: true,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getTicketLookups', //ticketStages
      objName: 'ticketStages',
    },
  },
  {
    name: 'inspectorIDs',
    displayName: 'שם פקח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    multipleSelect: true,
    dataFunction: {
      name: 'getInspectors',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityID',
        },
      ],
    },
  },
  {
    name: 'cityID',
    displayName: 'בחירת ישובים',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    multipleSelect: true,
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
    multipleSelect: true,
    dataFunction: {
      name: 'getStreets',
      extraParams: [
        // {
        //   connectedField: 'cityID',
        //   paramName: 'cityIDs',
        // },
        {
          connectedField: 'authorityID',
          paramName: 'authorityIDs',
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
    name: 'isCNChecked',
    displayName: 'מזהה לייצוא',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getExportType',
    },
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
  //ActionsFilter
  {
    name: 'isTriedRequestChecked',
    displayName: 'בקשות להישפט',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getYesNoOptions',
    },
  },
  //InterfaceFilter
  {
    name: 'determiningDateFrom',
    displayName: 'תאריך קובע מ',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  //InterfaceFilter
  {
    name: 'determiningDateTo',
    displayName: 'תאריך קובע עד',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  //OtherFilter
  {
    name: 'fromPaymentBalance',
    displayName: 'יתרת תשלומים מ',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  //OtherFilter
  {
    name: 'toPaymentBalance',
    displayName: 'יתרת תשלומים עד',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'fromFeeBalance',
    displayName: 'יתרת אגרות מ',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'toFeeBalance',
    displayName: 'יתרת אגרות עד',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'postStatus',
    displayName: 'סטטוס דואר הודעת תשלום',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,

    dataFunction: {
      name: 'getPostStatus',
    },
  },
];

export const noticeOptionFields: Field[] = [
  {
    name: 'noticeType',
    displayName: 'אופן ההפקה',
    isRequired: true,
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingTypes',
    },
  },
  // {
  //   name: 'engraving',
  //   displayName: 'בחירת גלופה',
  //   type: FieldTypeEnum.Select,
  //   length: FieldLengthEnum.Long,
  //   dataFunction: {
  //     name: 'getDraftAndLetters',
  //     extraParams: [
  //       {
  //         connectedField: 'authorityID',
  //         paramName: 'authorityID',
  //       },
  //       // {
  //       //   connectedField: 'noticeMessageOptionId',
  //       //   paramName: 'noticeMessageOptionId',
  //       // },
  //     ],
  //   },
  // },
  {
    name: 'sendDate',
    displayName: 'תאריך משלוח הודעה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'isCombined',
    displayName: 'סוג הודעה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getMessageType',
    },
    isRequired: true,
  },
  {
    name: 'sendingType',
    displayName: 'סוג משלוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    multipleSelect: false,
    // disabled:true,
    dataFunction: {
      name: 'getSendingType',
    },
    isRequired: true,
  },
  {
    name: 'dayToPay',
    displayName: 'ימים לתשלום',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    disabled: true,
  },
  // {
  //   name: 'ticketsWithPictures',
  //   displayName: 'לכלול דוחות רק עם תמונות?',
  //   type: FieldTypeEnum.Select,
  //   length: FieldLengthEnum.Long,
  //   dataFunction: {
  //     name: 'getYesNoOptions',
  //   },
  // },
  // {
  //   name: 'numberOfPictures',
  //   displayName: 'מספר תמונות בדוח',
  //   type: FieldTypeEnum.Text,
  //   length: FieldLengthEnum.Long,
  // },
  {
    name: 'additionalFee',
    displayName: 'תוספת אגרה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getFees',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityID',
        },
      ],
    },
  },

  {
    name: 'debatorMail',
    displayName: 'שליחת מייל לחייב',
    type: FieldTypeEnum.Checkbox,
    length: FieldLengthEnum.Long,
  },
];

export const disabledNoticeOptionFields: Field[] = [
  {
    name: 'noticeType',
    displayName: 'אופן ההפקה',
    type: FieldTypeEnum.Select,
    isRequired: true,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingTypes',
    },
  },

  {
    name: 'sendDate',
    displayName: 'תאריך משלוח הודעה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'isCombined',
    displayName: 'סוג הודעה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getMessageType',
    },
    isRequired: true,
  },
  {
    name: 'sendingType',
    displayName: 'סוג משלוח',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    multipleSelect: false,
    disabled: true,
    dataFunction: {
      name: 'getSendingType',
    },
  },
  {
    name: 'dayToPay',
    displayName: 'ימים לתשלום',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    disabled: true,
  },
  // {
  //   name: 'ticketsWithPictures',
  //   displayName: 'לכלול דוחות רק עם תמונות?',
  //   type: FieldTypeEnum.Select,
  //   length: FieldLengthEnum.Long,
  //   dataFunction: {
  //     name: 'getYesNoOptions',
  //   },
  // },
  // {
  //   name: 'numberOfPictures',
  //   displayName: 'מספר תמונות בדוח',
  //   type: FieldTypeEnum.Text,
  //   length: FieldLengthEnum.Long,
  // },
  {
    name: 'additionalFee',
    displayName: 'תוספת אגרה',
    type: FieldTypeEnum.Select ,
    length: FieldLengthEnum.Long,
    isRequired: true,
    dataFunction: {
      name: 'getFees',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityID',
        },
      ],
    },
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
    name: 'templateId',
    displayName: 'סוג הודעה להפקה',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getPrintingMessageType',
    },
  },
  {
    name: 'fromDate',
    displayName: 'מתאריך הפקה',
    type: FieldTypeEnum.Date,
    length: FieldLengthEnum.Long,
  },
  {
    name: 'toDate',
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
    name: 'userId',
    displayName: 'הופק ע"י',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    dataFunction: {
      name: 'getManotUsers',
      extraParams: [
        {
          connectedField: 'authorityID',
          paramName: 'authorityID',
        },
      ],
    },
  },
];

export const noticesUploadFields: DynamicRow[] = [
  {
    row: [
      {
        name: 'file',
        type: 'file',
        label: 'קובץ',
        validations: { required: true },
        hide: false,
        size: DynamicFieldSize.Double,
        isRequired: true,
      },
      {
        name: 'authorityID',
        type: 'text',
        label: 'תוכן הגלופה ',
        validations: { required: true },
        hide: true,
        size: DynamicFieldSize.Double,
        isRequired: true,
      },
      {
        name: 'manaId',
        type: 'text',
        label: 'תוכן הגלופה ',
        validations: { required: true },
        hide: true,
        size: DynamicFieldSize.Double,
        isRequired: true,
      },
      {
        name: 'fileType',
        type: 'text',
        label: 'תוכן הגלופה ',
        validations: { required: true },
        hide: true,
        size: DynamicFieldSize.Double,
        isRequired: true,
        value: 'pdf',
      },

      {
        name: 'actionType',
        type: 'text',
        label: 'תוכן הגלופה ',
        validations: { required: true },
        hide: true,
        size: DynamicFieldSize.Double,
        isRequired: true,
      },
    ],
  },
];
