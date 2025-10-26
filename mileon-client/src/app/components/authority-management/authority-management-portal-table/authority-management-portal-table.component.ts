import { Component, EventEmitter, Input, Output, OnInit, inject, ChangeDetectionStrategy, signal, computed, input } from '@angular/core';
import { AuthorityManagementTable } from '../../../types/management/authority-management-table.model';
import { Column } from '../../../types/table';
import { RedLineErrorComponent } from '../../shared/errors/red-line-error/red-line-error.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-portal-table',
  templateUrl: './authority-management-portal-table.component.html',
  styleUrls: ['./authority-management-portal-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RedLineErrorComponent,
  ],
})
export class AuthorityManagementPortalTableComponent implements OnInit {
  readonly data = input<any[]>([]);
  readonly title = input<string>('');
  readonly activeColumns = input<string[]>(['parking', 'general', 'administrative']);
  readonly tableId = input<string>('');

  @Output() valuesChanged = new EventEmitter<any>();

  private readonly _allColumns = signal<Column[]>([]);
  private readonly _errorMsg = signal<string>('');
  private readonly _loader = signal<boolean>(false);
  private readonly _originalData = signal<any[]>([]);
  private readonly _selectedValues = signal<{ [key: string]: any }>({});

  readonly allColumns = computed(() => this._allColumns());
  readonly errorMsg = computed(() => this._errorMsg());
  readonly loader = computed(() => this._loader());
  readonly originalData = computed(() => this._originalData());
  readonly selectedValues = computed(() => this._selectedValues());

  constructor() {
    const columns = new AuthorityManagementTable();
    this._allColumns.set(columns.AuthorityPortalColumns);
  }

  ngOnInit(): void {
    // Wait until `data` has all values (fieldNameValue included)
    setTimeout(() => {
      this._originalData.set(JSON.parse(JSON.stringify(this.data())));
    });
  }

  isColumnActive(columnName: string): boolean {
    return this.activeColumns().includes(columnName);
  }

  // Check if a column should have radio buttons for a specific row
  isColumnActiveForRow(row: any, columnName: string): boolean {
    // First check if the column is active for the table
    const isTableColumnActive = this.activeColumns().includes(columnName);

    // Then check if the row has specific column configuration
    if (row.activeColumns && Array.isArray(row.activeColumns)) {
      return isTableColumnActive && row.activeColumns.includes(columnName);
    }

    // Default to table-level configuration
    return isTableColumnActive;
  }

  onRadioChange(rowIndex: number, column: string, value: string) {
    const key = `${column}_${rowIndex}`;
    const currentValues = { ...this.selectedValues() };
    currentValues[key] = value;
    this._selectedValues.set(currentValues);

    const row = this.data()[rowIndex];
    const serverKey = row?.serverKeys?.[column];

    this.valuesChanged.emit({
      tableId: this.tableId(),
      values: this.selectedValues(),
      rowIndex,
      column,
      value,
      serverKey,
    });
  }

  getCurrentValue(rowIndex: number, column: string): string {
    const row = this.data()[rowIndex];

    const serverKey = row?.serverKeys?.[column];

    const selectedKey = `${column}_${rowIndex}`;
    if (this.selectedValues()[selectedKey] !== undefined) {
      return this.selectedValues()[selectedKey];
    }

    if (serverKey && row.hasOwnProperty(serverKey)) {
      return row[serverKey] ? 'yes' : 'no';
    }

    return '';
  }
}
