import { Injectable } from '@angular/core';
import { NoticesTable } from '../../../types/notices/notices-table/notices-table.model';
import { Column } from '../../../types/table';

@Injectable({
  providedIn: 'root',
})
export class NoticesTableService {
  table: NoticesTable;
  columns: Column[];
  
  constructor() {
    const noticesTable = new NoticesTable();
    this.table = noticesTable;
    this.columns = noticesTable.NoticesMainColumns;
  }
}
