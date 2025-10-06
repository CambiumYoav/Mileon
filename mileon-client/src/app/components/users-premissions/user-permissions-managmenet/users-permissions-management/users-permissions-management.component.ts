import { Component, Input, OnInit, OnDestroy, signal, computed, inject, effect } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthorityService } from '../../../../services/authority.service '; 
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../../types/filters/filterOptions';
import { Column } from '../../../../types/table';
import { User } from '../../../../types/user';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { MatDialog } from '@angular/material/dialog';
import { UsersPermissionsManagementAssignedComponent } from '../users-permissions-management-assigned/users-permissions-management-assigned.component';
import { TableService } from '../../../../components/shared/table/table.service';
import { UserPremissionsManagmentTable } from '../../../../types/user-permissions/user-permissions-table.model';
import { UserPermissionsManagementAddUserComponent } from '../user-permissions-management-add-user/user-permissions-management-add-user.component';
import { UserPremissionsManagmentService } from '../user-premissions-managment.service';
import { UsersPermissionsManagementSearchFormService } from '../users-permissions-management-search/users-permissions-management-search-form.service';
import { UsersPermissionsManagementSearchComponent } from '../users-permissions-management-search/users-permissions-management-search.component';
import { UsersPermissionsManagementTableComponent } from '../users-permissions-management-table/users-permissions-management-table.component';
import { ButtonComponent } from '../../../../components/shared/base/button/button.component';
import { CORE_IMPORTS } from '../../../../shared/shared-modules';

interface AreasResponse {
  list: any[];
  total: number;
  count: number;
}

@Component({
  selector: 'app-users-permissions-management',
  templateUrl: './users-permissions-management.component.html',
  styleUrls: ['./users-permissions-management.component.scss'],
  standalone: true,
  imports: [
    ...CORE_IMPORTS,
    UsersPermissionsManagementSearchComponent,
    UsersPermissionsManagementTableComponent,
    ButtonComponent,
  ],
  providers: [TableService],
})
export class UsersPermissionsManagementComponent implements OnInit, OnDestroy {
  private usersSearchFormService = inject(UsersPermissionsManagementSearchFormService);
  private authorityService = inject(AuthorityService);
  private dialog = inject(MatDialog);
  private userPremissionsManagmentService = inject(UserPremissionsManagmentService);

  isDialogOpen = signal(false);
  title = signal(TitlesEnum.PermissionsManagement);
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal(0);
  count = signal(0);
  searchText = signal('');
  searchData = signal<UsersFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  filter = signal<FilterOptions>({
    searchText: '',
    currentPage: 1,
  });
  list = signal<User[]>([]);
  currentAuthority = signal<string | null>(null);
  isModalOpen = signal(false);
  linkedUsers = signal<any[]>([]);
  selectedAreaName = signal('');
  selectedAreaId = signal('');
  loader = signal(false);

  hasData = computed(() => this.data().length > 0);
  isLoading = computed(() => this.loader());

  constructor() {
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.usersSearchFormService.form.value);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new UserPremissionsManagmentTable();
    this.columns.set(tableColumns.UserPremissionsManagmentColumns);

    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });
    
    this.authorityService.setMunicipalsToNationalRegional();
  }

  ngOnDestroy(): void {
    this.usersSearchFormService.clearForm();
  }

  async loadData(filter: any) {
    this.loader.set(true);
    try {
      const updatedFilter = { 
        ...filter, 
        authorityId: this.currentAuthority(),
        pageSize: filter?.pageSize || 100
      };
      
      const result = await this.userPremissionsManagmentService.getAreas(
        updatedFilter
      ) as AreasResponse;

      if (result && result.list) {
        const mappedData = result.list.map((area: any) => ({
          ...area,
          totalUsers: area.linkedUsers?.length || 0,
        }));
        
        this.data.set(mappedData);
        this.total.set(result.total || 0);
        this.count.set(result.count || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      this.loader.set(false);
    }
  }

  async onEditClick(event: any) {
    this.linkedUsers.set(event.linkedUsers || event.item.linkedUsers);
    this.selectedAreaName.set(event.areaName || event.item.areaName);
    this.selectedAreaId.set(event.areaID || event.item.areaID);

    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const dialogRef = this.dialog.open(UsersPermissionsManagementAssignedComponent, {
      autoFocus: true,
      data: {
        areaName: this.selectedAreaName(),
        tableData: this.linkedUsers(),
        areaID: this.selectedAreaId(),
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen.set(false);
      this.loadData(this.usersSearchFormService.form.value);
    });
  }

  async openDialogForm() {
    const dialogRef = this.dialog.open(UserPermissionsManagementAddUserComponent, {
      data: {},
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen.set(false);
      this.loadData(this.usersSearchFormService.form.value);
    });
  }
}
