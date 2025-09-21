import { Injectable } from '@angular/core';
import { Column } from '../../../../types/table';
import { UsersTable } from '../../../../types/users/users-table.model';

@Injectable({
  providedIn: 'root',
})
export class UsersTableService {
  table: UsersTable;
  columns: Column[];

  constructor() {
    const usersTable = new UsersTable();

    this.table = usersTable;
    this.columns = usersTable.UsersMainColumns;
  }
}
