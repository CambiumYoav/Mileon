import { Column, ColumnTypeEnum } from '../table';

export class AuthorityManagementTable {
  public AuthorityFormsColumns: Column[] = [
    {
      displayName: 'שדות למילוי בפורטל',
      propertyName: 'displayName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'חובה',
      propertyName: 'isRequired',
      canSort: true,
      type: ColumnTypeEnum.Checkbox,

      sortByServer: false,
    },
  ];

  public AuthorityPortalColumns: Column[] = [
    {
      displayName: 'מחלקת חניה',
      propertyName: 'parking',
      canSort: true,
      type: ColumnTypeEnum.Radio,

      sortByServer: false,
    },
    {
      displayName: 'מחלקת פיקוח כללי',
      propertyName: 'general',
      canSort: true,
      type: ColumnTypeEnum.Radio,

      sortByServer: false,
    },
    {
      displayName: 'מחלקת וטרינריה מנהלי ',
      propertyName: 'administrative',
      canSort: true,
      type: ColumnTypeEnum.Radio,

      sortByServer: false,
    },
  ];

  public DraftsAndLettersColumns: Column[] = [
    {
      displayName: ' ',
      propertyName: 'gid',
      canSort: true,
      type: ColumnTypeEnum.Radio,

      sortByServer: false,
    },
    {
      displayName: 'קוד ',
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,

      sortByServer: false,
    },
    {
      displayName: 'סוג',
      propertyName: 'typeDescription',
      canSort: true,
      type: ColumnTypeEnum.Text,

      sortByServer: false,
    },
    {
      displayName: 'שם גלופה / מכתב ',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,

      sortByServer: false,
    },
    {
      displayName: ' סיווג דוח ',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,

      sortByServer: false,
    },
    {
      displayName: 'מחלקת וטרינריה מנהלי ',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Hidden,

      sortByServer: false,
    },

    {
      displayName: 'מחלקת וטרינריה מנהלי ',
      propertyName: 'typeId',
      canSort: true,
      type: ColumnTypeEnum.Hidden,

      sortByServer: false,
    },
  ];
}
