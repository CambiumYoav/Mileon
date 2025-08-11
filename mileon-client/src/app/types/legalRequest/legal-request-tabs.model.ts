import {
  Field,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../advanced-search/form-tab.model';

export class LegalRequestTabs {
  public static legalRequestSystemDetails: Field[] = [
    {
      name: 'confirmByName',
      displayName: 'גורם מטפל',
      type: FieldTypeEnum.Text,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'confirmDate',
      displayName: 'תאריך טיפול',
      type: FieldTypeEnum.Date,
      length: FieldLengthEnum.Medium,
    },
    {
      name: 'confirmDate',
      displayName: 'שעת טיפול',
      type: FieldTypeEnum.Time,
      length: FieldLengthEnum.Medium,
    },
  ];
}
