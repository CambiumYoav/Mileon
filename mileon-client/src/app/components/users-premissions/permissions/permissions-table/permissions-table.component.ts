import { Component, OnInit, signal, computed, input, output, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterOptions } from '../../../../types/filters/filterOptions';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TicketFilterOptions } from '../../../../types/filters/ticket/ticketFilterOptions';
import { Icon } from '../../../../types/icon';
import { Column } from '../../../../types/table';
import { UsersSearchFormService } from '../../users/users-search/users-search-form.service';
import { PermissionsTableService } from './permissions-table.service';
import { EditOrDeleteEvent } from '../../../../types/permissions/editOrDeleteEvent';
import { PermissionsSearchFormService } from '../permissions-search/permissions-search-form.service';
import { TableComponent } from '../../../../components/shared/table/table.component';

@Component({
  selector: 'app-permissions-table',
  templateUrl: './permissions-table.component.html',
  styleUrls: ['./permissions-table.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TableComponent]
})
export class PermissionsTableComponent implements OnInit {
  private readonly permissionsTableService = inject(PermissionsTableService);
  private readonly userSearchForm = inject(PermissionsSearchFormService);

  showSort = input<boolean>(false);
  sortFromClient = input<boolean>(false);
  filters = input<FilterOptions>({ currentPage: 1 });
  data = input<any[]>([]);
  total = input<number>(0);
  count = input<number>(0);
  selectedUserData = input<any>(null);
  loader = input<boolean>(false);
  showPaginator = input<boolean>(true);
  tableColumns = input<string>('');

  onFormChanges = output<TicketFilterOptions>();
  isEditOrDelete = output<EditOrDeleteEvent>();

  dialogData = signal<any>(null);
  userForm = signal<FormGroup>(this.userSearchForm.searchForm());
  _columns = signal<Column[]>([]);

  columns = computed(() => this._columns());
  hasData = computed(() => this.data().length > 0);
  isLoading = computed(() => this.loader());

  constructor() {
    effect(() => {
      const tableName = this.tableColumns();
      if (tableName) {
        this._columns.set(this.permissionsTableService.getTableColumns(tableName));
      }
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.userForm.set(this.userSearchForm.searchForm());
  }

  emitServerSort(form: FormGroup): void {
    this.onFormChanges.emit(form.value);
  }

  editOrDeleteGroup(element: any): void {
    const iconName = element.iconName;
    const action =
      iconName === 'edit'
        ? 'edit'
        : iconName === 'trash-outline'
        ? 'delete'
        : null;

    if (action) {
      this.isEditOrDelete.emit({ action, data: element });
    }
  }

  onRowEvent(event: any): void {
    this.editOrDeleteGroup(event);
  }

  onFormChange(event: FormGroup): void {
    this.emitServerSort(event);
  }
}
