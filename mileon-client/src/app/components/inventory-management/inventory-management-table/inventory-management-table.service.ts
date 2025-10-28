import { Injectable } from '@angular/core';
import { InventoryManagementTable } from '../../../types/inventory-management/inventory-management-table.model';
import { Column } from '../../../types/table';

@Injectable({
  providedIn: 'root',
})
export class InventoryManagementTableService {
  table: InventoryManagementTable;
  columns: Column[];

  constructor() {
    const inventoryManagementTable = new InventoryManagementTable();

    this.table = inventoryManagementTable;
    this.columns = inventoryManagementTable.InventoryMainColumns;
  }
}
