import { Injectable } from '@angular/core';
import { AuthorityManagementTable } from '../../../types/management/authority-management-table.model';
import { Column } from '../../../types/table';

@Injectable({
  providedIn: 'root',
})
export class AuthorityManagementTableService {
  table: AuthorityManagementTable;
  columns: Column[];

  constructor() {
    const authorityManagementTable = new AuthorityManagementTable();

    this.table = authorityManagementTable;
    this.columns = authorityManagementTable.DraftsAndLettersColumns;
  }
}
