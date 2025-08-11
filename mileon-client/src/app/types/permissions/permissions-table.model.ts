import { Column, ColumnTypeEnum } from '../table';

export class PermissionsTable {
  public PermissionsGroupsColumns: Column[] = [
    {
      displayName: '#',
      propertyName: 'roleID',
      canSort: false,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שם קבוצה',
      propertyName: 'name',
      canSort: true,
      type: ColumnTypeEnum.Tag,
      sortByServer: false,
    },
    {
      displayName: 'תיאור קבוצה',
      propertyName: 'description',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'משוייכים',
      propertyName: 'assignedUsers',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'עריכה',
      propertyName: 'roleID',
      canSort: true,
      type: ColumnTypeEnum.Icon,

      sortByServer: false,
    },
    {
      displayName: 'מחק',
      propertyName: 'roleID',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      icon: 'TRASH_TABLE',
      sortByServer: false,
    },
  ];


}
