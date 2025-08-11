import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';

//FIXME - update all the names from the server
export const ConfigFields: { row: Field[] }[] = [
  // Group fields for a single row
  {
    row: [
      {
        name: 'costumerNumber',
        displayName: 'מספר לקוח',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'serviceNumber',
        displayName: 'מספר שירות',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
    ],
  },
  {
    row: [
      {
        name: 'requestedData',
        displayName: 'שדות מידע מבוקש',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Long,
      },
    ],
  },
  {
    row: [
      {
        name: 'subServiceNumber',
        displayName: 'מספר תת שירות',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'batch',
        displayName: 'מאגר',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'sendingFileDate',
        displayName: 'תאריך שליחת הקובץ',
        type: FieldTypeEnum.Text, // or text?
        length: FieldLengthEnum.Medium,
      },

      {
        name: 'referenceForm',
        displayName: 'סימוכין טופס ב',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
    ],
  },
  {
    row: [
      {
        name: 'customerServiceAuthId',
        displayName: 'מזהה אישור שירות ללקוח',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
    ],
  },

  {
    row: [
      {
        name: 'firstFreeField',
        displayName: 'שדה חופשי 1',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'secondFreeField',
        displayName: 'שדה חופשי 2',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'thirdFreeField',
        displayName: 'שדה חופשי 3',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
      {
        name: 'fourthFreeField',
        displayName: 'שדה חופשי 4',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
    ],
  },
  {
    row: [
      {
        name: 'fifthFreeField',
        displayName: 'שדה חופשי 5',
        type: FieldTypeEnum.Text,
        length: FieldLengthEnum.Medium,
      },
    ],
  },
];
