import { Injectable } from '@angular/core';
import { Column } from '../../../types/table';
import { TicketTable } from '../../../types/ticket/ticket-table.model';

@Injectable({
  providedIn: 'root',
})
export class TicketsTableService {
  table: TicketTable;

  columns: Column[];

  constructor() {
    const ticketsTable = new TicketTable();
    this.table = ticketsTable;
    this.columns = ticketsTable.MainColumns;
  }
}
