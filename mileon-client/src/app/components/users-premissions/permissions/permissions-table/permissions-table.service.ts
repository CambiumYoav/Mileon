import { Injectable, signal, computed, inject } from '@angular/core';
import { PermissionsTable } from '../../../../types/permissions/permissions-table.model';
import { Column } from '../../../../types/table'; 

@Injectable({
  providedIn: 'root',
})
export class PermissionsTableService {
  table = signal<PermissionsTable>(new PermissionsTable());
  columns = signal<Column[]>([]);

  permissionsGroupsColumns = computed(() => this.table().PermissionsGroupsColumns);
  hasTable = computed(() => !!this.table());
  hasColumns = computed(() => this.columns().length > 0);

  constructor() {
    this.initializeTable();
  }

  private initializeTable(): void {
    const permissionsTable = new PermissionsTable();
    this.table.set(permissionsTable);
    this.columns.set(permissionsTable.PermissionsGroupsColumns);
  }

  getTableColumns(tableName: string): Column[] {
    const table = this.table();
    return table[tableName as keyof PermissionsTable] as Column[] || [];
  }

  updateTable(newTable: PermissionsTable): void {
    this.table.set(newTable);
  }

  updateColumns(newColumns: Column[]): void {
    this.columns.set(newColumns);
  }

  getColumnByName(columnName: string): Column | undefined {
    return this.columns().find(col => col.propertyName === columnName);
  }
}
