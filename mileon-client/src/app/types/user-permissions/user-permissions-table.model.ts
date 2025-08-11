import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicField } from '../infrastructure/InfrastructureTypes';
import { Column, ColumnTypeEnum } from '../table';

export class UserPremissionsManagmentTable {
  public UserPremissionsManagmentColumns: Column[] = [
    // {
    //   displayName: '#',
    //   propertyName: 'userID',
    //   canSort: false,
    //   type: ColumnTypeEnum.Text,
    //   sortByServer: false,
    // },
    {
      displayName: 'אזור',
      propertyName: 'areaName',
      canSort: true,
      type: ColumnTypeEnum.Tag,
      sortByServer: false,
    },
    {
      displayName: 'עובדים משוייכים',
      propertyName: 'totalUsers',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'ערוך עובדים משוייכים',
      propertyName: 'users',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: false,
    },
  ];

  public AssignedUsersColumns: Column[] = [
    {
      displayName: '#',
      propertyName: 'userID',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: 'שם פרטי',
      propertyName: 'firstName',
      canSort: true,
      sortField: 'firstName',
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שם משפחה',
      propertyName: 'lastName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'ת.ז',
      propertyName: 'userNID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'users',
      canSort: false,
      type: ColumnTypeEnum.Icon,
      icon: 'TRASH_DARK',
      sortByServer: false,
    },
  ];
  public AddUsersColumns: Column[] = [
    {
      displayName: '#',
      propertyName: 'userID',
      canSort: false,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: 'שם פרטי',
      propertyName: 'firstName',
      canSort: true,
      sortField: 'firstName',
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'שם משפחה',
      propertyName: 'lastName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'ת.ז',
      propertyName: 'userNID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'users',
      canSort: false,
      type: ColumnTypeEnum.Icon,
      icon: 'ADD',
      sortByServer: false,
    },
  ];
}
export class PermissionsForms {
  public CreateGroupForm: DynamicField[] = [
    {
      name: 'name',
      type: 'text',
      label: 'שם קבוצה',
      value: '',
      validations: { required: true },
      disabled: false,
      hide: false,
      size: DynamicFieldSize.Regular,
      isRequired:true
    },
    {
      name: 'description',
      type: 'text',
      label: 'תיאור קבוצה',
      value: '',
      validations: {},
      disabled: false,
      hide: false,
      size: DynamicFieldSize.Square,
      isRequired:true
    },
  ];
}
