import { Column, ColumnTypeEnum } from '../table';

export class MsofonTable {
  public TicketBookColumns: Column[] = [
    {
      displayName: '',
      propertyName: 'bookID',
      canSort: true,
      type: ColumnTypeEnum.Radio,
      sortByServer: false,
    },
    {
      displayName: 'סדרת פנקס',
      propertyName: 'seriesNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'מספר פנקס',
      propertyName: 'bookNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סוג דוח',
      propertyName: 'ticketTypeName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שם פקח',
      propertyName: 'inspectorName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'תאריך קליטה',
      propertyName: 'creationDate',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: false,
    },
    {
      displayName: 'מדוח',
      propertyName: 'fromTicketNumbr',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'עד דוח',
      propertyName: 'toTicketNumbr',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סה"כ דוחות',
      propertyName: 'ticketCount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'פתוח',
      propertyName: 'ticketOpenCount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: '',
      propertyName: 'bookID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];

  public InspectorsColumns: Column[] = [
    {
      displayName: 'חיבור אחרון',
      propertyName: 'lastTicketTime',
      canSort: true,
      type: ColumnTypeEnum.ActiveStatus,
      sortByServer: false,
    },
    {
      displayName: 'שם פקח ',
      propertyName: 'inspectorName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שעה',
      propertyName: 'lastTicketTime',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'דוחות',
      propertyName: 'ticketsCount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'inspectorID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];

  public InspectorColumns: Column[] = [
    {
      displayName: 'מספר דוח',
      propertyName: 'ticketNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'מיקום  ',
      propertyName: 'ticketGivingAddress',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שעה',
      propertyName: 'violationTime',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'ס.ע',
      propertyName: 'violationSection',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סכום',
      propertyName: 'fineAmount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'ticketID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];

  public InspectorsMessagesColumns: Column[] = [
    {
      displayName: 'שם פקח ',
      propertyName: 'inspectorName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: true,
    },
    {
      displayName: 'תיאור',
      propertyName: 'taskDescription',
      canSort: false,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'תאריך ושעה',
      propertyName: 'taskCreationDate',
      canSort: true,
      type: ColumnTypeEnum.DateTime,
      sortByServer: true,
    },

    {
      displayName: '',
      propertyName: 'inspectorId',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];

  public TerminalGeneralSettingsColumns: Column[] = [
    {
      displayName: 'משימה / הודעה',
      propertyName: 'seriesNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שם פקח ',
      propertyName: 'seriesNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'תיאור',
      propertyName: 'bookNumber',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'bookID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];

  public InspectorsStatisticsColumns: Column[] = [
    {
      displayName: 'שם פקח ',
      propertyName: 'inspectorName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'כמות דוחות',
      propertyName: 'ticketsCount',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סכום',
      propertyName: 'formattedTicketsSum',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
  ];
}
