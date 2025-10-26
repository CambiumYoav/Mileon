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
      propertyName: 'selected',
      canSort: false,
      type: ColumnTypeEnum.Radio,
      sortByServer: false,
      radioConfig: {
        // Single radio button per row; shared name across rows ensures single selection
        name: 'draftsAndLettersRowSelect',
        options: [
          { value: 'selected', label: '' }
        ],
        type: 'default',
        direction: 'horizontal',
      },
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
      displayName: 'GUID',
      propertyName: 'gid',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName: 'Is Active',
      propertyName: 'isActive',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName: 'Type ID',
      propertyName: 'typeId',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];
}
