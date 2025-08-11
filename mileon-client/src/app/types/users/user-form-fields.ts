import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';

export const userFields: Field[] = [
  {
    name: 'email',
    displayName: 'כתובת מייל',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'userName',
    displayName: 'שם משתמש',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'firstName',
    displayName: 'שם פרטי',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'lastName',
    displayName: 'שם משפחה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'id',
    displayName: 'תעודת זהות',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },

  {
    name: 'phone',
    displayName: 'טלפון נייד',
    type: FieldTypeEnum.Phone,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'password',
    displayName: 'סיסמה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
];

export const userLocalFields: Field[] = [
  {
    name: 'email',
    displayName: 'כתובת מייל',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'userName',
    displayName: 'שם משתמש',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'firstName',
    displayName: 'שם פרטי',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'lastName',
    displayName: 'שם משפחה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'id',
    displayName: 'תעודת זהות',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },

  {
    name: 'phone',
    displayName: 'טלפון נייד',
    type: FieldTypeEnum.Phone,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'password',
    displayName: 'סיסמה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'appAccess',
    displayName: 'גישה לאפליקציות',
    type: FieldTypeEnum.CheckboxWithOptions,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'dataAccess',
    displayName: 'הרשאה במערכת',
    type: FieldTypeEnum.CheckboxWithOptions,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'automationGeneralCode',
    displayName: 'קוד אוטומציה כללי',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },
  {
    name: 'automationParkingCode',
    displayName: 'קוד אוטומציה חניה',
    type: FieldTypeEnum.Text,
    length: FieldLengthEnum.Long,
    isRequired: true,
  },

  {
    name: 'groupAccess',
    displayName: 'כל הקבוצות',
    type: FieldTypeEnum.Select,
    length: FieldLengthEnum.Long,
    multipleSelect: true,
    options: [],
    dataFunction: {
      name: 'getSystemRoles',
    },
    isRequired: true,
  },
];
