import { Component, EventEmitter, Input, OnInit, Output, inject, signal, computed, input, output, effect } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterService } from '../../../../services/router.service';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { SessionService } from '../../../../services/session.service';
import { FilterOptions } from '../../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../../types/filters/ticket/ticketFilterOptions';
import { Icon } from '../../../../types/icon';
import { Column } from '../../../../types/table';
import { TicketIcons } from '../../../../types/ticket/ticket-icons.model';
import { User } from '../../../../types/user';
import { UsersPermissionsManagementTableService } from './users-permissions-management-table.service';
import { UsersPermissionsManagementSearchFormService } from '../users-permissions-management-search/users-permissions-management-search-form.service';
import { UsersPermissionsFilterOptions } from '../../../../types/user-permissions/userPermissionFilterOptions';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TableComponent } from '../../../../components/shared/table/table.component';

@Component({
  selector: 'app-users-permissions-management-table',
  templateUrl: './users-permissions-management-table.component.html',
  styleUrls: ['./users-permissions-management-table.component.scss'],
  imports: [CommonModule, TableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class UsersPermissionsManagementTableComponent implements OnInit {
  showSort = input<boolean>(false);
  sortFromClient = input<boolean>(false);
  filters = input<FilterOptions>({ currentPage: 1 });
  data = input<any[]>([]);
  total = input<number>(0);
  count = input<number>(0);
  loader = input<boolean>(true);
  showPaginator = input<boolean>(true);
  pageSize = input<number>(100);
  tableColumns = input<string>('');

  onFormChanges = output<UsersPermissionsFilterOptions>();
  onRowClick = output<any>();

  private columnsSignal = signal<Column[]>([]);
  private selectedUserDataSignal = signal<any>(null);
  private tableColumnsSignal = signal<string>('');

  columns = computed(() => this.columnsSignal());
  selectedUserData = computed(() => this.selectedUserDataSignal());

  userForm: FormGroup;

  TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private usersPermissionsTableService = inject(UsersPermissionsManagementTableService);
  private usersPermissionsManagementSearchForm = inject(UsersPermissionsManagementSearchFormService);
  private routerService = inject(RouterService);
  private sessionService = inject(SessionService);

  constructor() {
    this.userForm = this.usersPermissionsManagementSearchForm.searchForm;
    
    effect(() => {
      const tableName = this.tableColumns();
      this.tableColumnsSignal.set(tableName);
      if (tableName) {
        const columns = (this.usersPermissionsTableService.table as any)[tableName];
        this.columnsSignal.set(columns);
      }
    });
  }

  ngOnInit(): void {}

  async goToEditUser(user: any) {
    this.saveUserSession(user);
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.UsersPermissions.Home,
        ROUTE_PATH.UsersPermissions.User,
        user.userID,
      ],
      true
    );
  }
  emitRowEvent(event: any) {
    this.onRowClick.emit(event);
  }
  saveUserSession(user: User) {
    this.sessionService.set('user', user);
  }
  emitServerSort(form: any) {
    this.onFormChanges.emit(form.value);
  }
}
