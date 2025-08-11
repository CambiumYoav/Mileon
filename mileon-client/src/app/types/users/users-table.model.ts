import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicField } from '../infrastructure/InfrastructureTypes';
import { Column, ColumnTypeEnum } from '../table';

export class UsersTable {
  public UsersMainColumns: Column[] = [
    {
      displayName: 'שם משתמש',
      propertyName: 'username',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
      hasCheckbox: true,
    },
    {
      displayName: 'שם פרטי',
      propertyName: 'firstName',
      canSort: true,
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
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
      
    },
    {
      displayName: 'ת.ז',
      propertyName: 'phone',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
      
    },
    {
      displayName: '',
      propertyName: 'userID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
      
    },
    {
      displayName: '',
      propertyName: 'email',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
      
    },
    {
      displayName: '',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
      
    },
  ];
  public UsersLocalColumns: Column[] = [
    {
      displayName: 'שם משתמש',
      propertyName: 'username',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
      hasCheckbox: true,
    },
    {
      displayName: 'שם פרטי',
      propertyName: 'firstName',
      canSort: true,
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
      propertyName: 'id',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'גישה לאפליקציות',
      propertyName: 'appAccess',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'הרשאה במערכת',
      propertyName: 'groupAccess',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'קבוצות הרשאה',
      propertyName: 'dataAccess',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: '',
      propertyName: 'phone',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName: '',
      propertyName: 'userID',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'email',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'automationGeneralCode',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName: '',
      propertyName: 'automationParkingCode',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },

    {
      displayName: '',
      propertyName: 'isActive',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
  ];
}

export class UsersForms {
  public UsersResetPasswordForm: DynamicField[] = [
    {
      name: 'oldPassword',
      type: 'text',
      label: 'סיסמה קיימת',
      value: '',
      validations: { required: true },
      disabled: false,
      hide: false,
      size: DynamicFieldSize.Medium,
      isRequired: true,
    },
    {
      name: 'password',
      type: 'text',
      label: 'סיסמה חדשה',
      value: '',
      validations: { required: true },
      disabled: false,
      hide: false,
      size: DynamicFieldSize.Medium,
      isRequired: true,
    },
    {
      name: 'confirmPassword',
      type: 'text',
      label: 'אימות סיסמה חדשה',
      value: '',
      validations: { required: true },
      disabled: false,
      hide: false,
      size: DynamicFieldSize.Medium,
      isRequired: true,
    },
  ];
}
