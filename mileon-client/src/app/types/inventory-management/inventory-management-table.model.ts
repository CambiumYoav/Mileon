import { Column, ColumnTypeEnum } from '../table';

export class InventoryManagementTable {
  public InventoryMainColumns: Column[] = [
    {
      displayName: 'קוד',
      propertyName: 'deviceId',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'רשות',
      propertyName: 'authorityName',
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
      displayName: 'תפקיד',
      propertyName: 'roleHE',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },

    {
      displayName: 'מחלקה משויכת',
      propertyName: 'divisionName',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'טלפון',
      propertyName: 'inspectorPhone',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סוג הציוד',
      propertyName: 'typeNameHE',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'מזהה ציוד',
      propertyName: 'sn',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'תיאור',
      propertyName: 'description',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName: 'מפעיל סלולרי',
      propertyName: 'cellularOperatorHE',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'סטטוס הציוד',
      propertyName: 'statusNameHE',
      canSort: true,
      type: ColumnTypeEnum.Text,
      sortByServer: false,
    },
    {
      displayName: 'תאריך מסירה',
      propertyName: 'dateDelivery',
      canSort: true,
      type: ColumnTypeEnum.Date,
      sortByServer: false,
    },
    {
      displayName: '',
      propertyName: 'deviceId',
      canSort: true,
      type: ColumnTypeEnum.Icon,
      sortByServer: false,
    },
    {
      displayName:'',
      propertyName:'divisions',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName:'',
      propertyName:'statusId',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName:'',
      propertyName:'cellularOperatorId',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    },
    {
      displayName:'',
      propertyName:'typeId',
      canSort: true,
      type: ColumnTypeEnum.Hidden,
      sortByServer: false,
    }
  ];
}
