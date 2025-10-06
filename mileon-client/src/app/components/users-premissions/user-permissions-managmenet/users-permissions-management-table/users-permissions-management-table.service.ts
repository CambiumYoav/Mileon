import { Injectable } from '@angular/core';
import { Column } from '../../../../types/table';
import { UserPremissionsManagmentTable } from '../../../../types/user-permissions/user-permissions-table.model';

@Injectable({
  providedIn: 'root',
})
export class UsersPermissionsManagementTableService {
  table: UserPremissionsManagmentTable;
  columns: Column[];

  constructor() {
    const usersPremissionManagmentTable = new UserPremissionsManagmentTable();

    this.table = usersPremissionManagmentTable;
    this.columns =
      usersPremissionManagmentTable.UserPremissionsManagmentColumns;
  }
}
