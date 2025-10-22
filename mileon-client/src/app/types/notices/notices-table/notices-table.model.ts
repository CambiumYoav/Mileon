import { Column, ColumnTypeEnum } from '../../table';

export class NoticesTable {
  public NoticesMainColumns: Column[] = [
    {
      displayName: '',
      propertyName: 'manaId',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: true,
    },
    {
      displayName: '',
      propertyName: 'interfaceType',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: true,
    },
    {
      displayName: '',
      propertyName: 'postType',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: true,
    },
    {
      displayName: '',
      propertyName: 'selected',
      canSort: false,
      type: ColumnTypeEnum.Radio,
      sortByServer: false,
      radioConfig: {
        // Single radio button per row; shared name across rows ensures single selection
        name: 'noticesRowSelect',
        options: [
          { value: 'selected', label: '' }
        ],
        allowDeselect: false,
        direction: 'horizontal',
        type: 'default'
      }
    },
    {
      displayName: 'משלוח',
      propertyName: 'sendingNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'תאריך יצירת מנה',
      propertyName: 'sendDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'הופק ע"י',
      propertyName: 'userName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      textOverflow: true,
    },
    {
      displayName: 'מתאריך הפקה',
      propertyName: 'fromDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'עד תאריך הפקה',
      propertyName: 'toDate',
      canSort: false,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'כמות דוחות',
      propertyName: 'totalTickets',
      canSort: true,
      type: ColumnTypeEnum.Tag,
      sortByServer: true,
    },
    {
      displayName: 'אישור משלוח',
      propertyName: 'sendStatusId',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      hasIcon: true,
    },
    {
      displayName: 'העתק דוח',
      propertyName: 'paymentBalance',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      textColor: 'blue',
    },

    {
      displayName: 'תאריך קובע',
      propertyName: 'lastPaymentDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'סוג דוח',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'דואר',
      propertyName: 'displayInterfaceType', // מקומי בית דפוס
      canSort: false,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'מקור',
      propertyName: 'ticketSourceName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'אוכלוסייה',
      propertyName: 'isDisabled',
      canSort: false,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'נשלח',
      propertyName: 'sendStatusDisplay',
      canSort: false,
      type: ColumnTypeEnum.Checkbox,
      sortByServer: true,
      isDisabled: true,
      
    },
  ];
}
