import { Column, ColumnTypeEnum } from '../../table';

export class NoticesTable {
  public NoticesMainColumns: Column[] = [
    //FIXME - update the names

    //ManaId
    {
      displayName: '',
      propertyName: 'ticketID',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: true,
    },

    {
      displayName: '',
      propertyName: 'ticketID',
      canSort: false,
      type: ColumnTypeEnum.Radio,
      sortByServer: false,
    },
    {
      displayName: 'משלוח',
      propertyName: 'ticketNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'תאריך יצירת מנה',
      propertyName: 'nid',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'הופק ע"י',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      textOverflow: true,
    },
    {
      displayName: 'מתאריך הפקה',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'עד תאריך הפקה',
      propertyName: 'ticketStatusID',
      canSort: false,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'כמות דוחות',
      propertyName: 'ticketStatusName',
      canSort: true,
      type: ColumnTypeEnum.Tag,
      sortByServer: true,
      fieldId: 'ticketStatusID',
    },
    {
      displayName: 'אישור משלוח',
      propertyName: 'ticketStageName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
      fieldId: 'ticketStageID',
      hasIcon: true,
    },
    {
      displayName: 'העתק דוח',
      propertyName: 'paymentBalance',
      canSort: true,
      type: ColumnTypeEnum.Currency,
      sortByServer: true,
      textColor: 'blue',
    },

    {
      displayName: 'תאריך קובע',
      propertyName: 'ticketGivingDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'סוג דוח',
      propertyName: 'violationDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: true,
    },
    {
      displayName: 'דואר',
      propertyName: 'additionalTicketPaymentBalance',
      canSort: false,
      type: ColumnTypeEnum.Currency,
      sortByServer: true,
      textColor: 'black',
    },
    {
      displayName: 'מקור',
      propertyName: 'authorityName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'אוכלוסייה',
      propertyName: 'ticketStageID',
      canSort: false,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'נשלח',
      propertyName: 'ticketStageID',
      canSort: false,
      type: ColumnTypeEnum.Checkbox,
      sortByServer: true,
    },
  ];
}
