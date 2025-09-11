import { Injectable } from '@angular/core';
import { Column } from '../../../types/table';
import { MsofonTable } from '../../../types/terminal/terminal-table';

@Injectable({
  providedIn: 'root',
})
export class TerminalTableService {
  table: MsofonTable;
  columns: Column[];

  constructor() {
    const msofonTable = new MsofonTable();

    this.table = msofonTable;
    this.columns = msofonTable.TicketBookColumns;
  }
}
