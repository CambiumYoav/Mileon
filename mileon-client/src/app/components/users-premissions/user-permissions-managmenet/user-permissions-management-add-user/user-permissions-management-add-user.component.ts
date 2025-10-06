import { Component, Inject, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../../constants/const_path'; 
import { Column } from '../../../../types/table';
import { User } from '../../../../types/user';
import { UserPremissionsManagmentTable } from '../../../../types/user-permissions/user-permissions-table.model';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { SearchByTextEnum } from '../../../../types/enum/searchByTextEnum';
import { UserPremissionsManagmentService } from '../user-premissions-managment.service';
import { ActionEnum } from '../../../../types/enum/actionsEnum';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../../services/authority.service ';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { UserPermissionsAddUserSearchFormService } from '../user-permissions-add-user-search/user-permissions-add-user-search-form.service';
import { UserPermissionsAddUserSearchComponent } from '../user-permissions-add-user-search/user-permissions-add-user-search.component';
import { UserPremissionsAssignedTableComponent } from '../user-premissions-assigned-table/user-premissions-assigned-table.component';
import { SelectComponent } from '../../../shared/base/select/select.component';

@Component({
  selector: 'app-user-permissions-management-add-user',
  templateUrl: './user-permissions-management-add-user.component.html',
  styleUrls: ['./user-permissions-management-add-user.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    UserPermissionsAddUserSearchComponent,
    UserPremissionsAssignedTableComponent,
    SelectComponent
  ],
})
export class UserPermissionsManagementAddUserComponent implements OnInit, OnDestroy {

  private dialogRef = inject(MatDialogRef<UserPermissionsManagementAddUserComponent>);
  private dialog = inject(MatDialog);
  private usersPermissionsManagementSearchFormService = inject(UserPermissionsAddUserSearchFormService);
  private userPremissionsManagmentService = inject(UserPremissionsManagmentService);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  
  private destroy$ = new Subject<void>();

  columns = signal<Column[]>([]);
  tableData = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  title = signal<string>(TitlesEnum.AddUserTitle);
  searchText = signal<string>('');
  searchData = signal<UsersFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  list = signal<User[]>([]);
  form = signal<FormGroup>(this.usersPermissionsManagementSearchFormService.searchForm);
  selectedArea = signal<any>(null);
  areas = signal<any[]>([]);
  currentAuthority = signal<string>('');
  filter = signal<UsersFilterOptions>({
    searchText: '',
    currentPage: 1,
  });

  Icons = ConstPath;
  SearchByTextEnum = SearchByTextEnum;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { description: string; tableData: any[] }
  ) {
    this.form.set(this.usersPermissionsManagementSearchFormService.searchForm);
    
    this.form().addControl('area', new FormControl(null));
    
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      this.currentAuthority.set(authorityID || '');
      
      // Load areas when authority is available
      if (authorityID) {
        this.loadAreas();
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new UserPremissionsManagmentTable();
    this.columns.set(tableColumns.AddUsersColumns);

    this.form().get('area')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.changeType(value);
      });

    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });
    
    this.tableData.set([]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.usersPermissionsManagementSearchFormService.clearForm();
  }

  async fetchUsersByArea(filter: any) {
    this.tableData.set([]);
    try {
      const res = await this.userPremissionsManagmentService.getUsersByArea(
        this.selectedArea(),
        filter.searchText,
        this.currentAuthority()
      );

      if (res && Array.isArray(res)) {
        this.tableData.set(res);
        // If res has total and count properties, use them; otherwise use array length
        this.total.set((res as any).total || res.length);
        this.count.set((res as any).count || res.length);
      }
    } catch (e) {
      console.error('Error fetching users:', e);
    }
  }

  async loadAreas(filter?: any) {
    try {
      const res = await this.userPremissionsManagmentService.getAreasLookup(
        this.currentAuthority()
      );
      if (res && Array.isArray(res)) {
        // Convert the data format
        this.areas.set(res.map((area: any) => ({
          display: area.areaName, // Display name
          value: area.areaID, // ID as value
        })));
      }
    } catch (e) {
      console.error(e);
    }
  }

  changeType(value: any): void {
    if (!value) return;

    this.selectedArea.set(value);
    this.tableData.set([]);
    this.fetchUsersByArea(value);
  }

  onSubmit() {
    // Signal-based approach - no need for Subject
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  removeOrAssignUser(userData: any) {
    const userDataObject = [userData.user.userID];

    const actionHandlers: { [key: string]: () => void } = {
      [ActionEnum.Add]: () => this.updateAreaWithUser(userDataObject),
      [ActionEnum.Remove]: () => this.removeUserFromArea(userDataObject),
    };

    const action = userData.action as string;
    actionHandlers[action]?.();
  }

  async updateAreaWithUser(userData: any) {
    try {
      const res = await this.userPremissionsManagmentService.addUserToArea(
        this.selectedArea(),
        userData
      );
      if (res) {
        this.toaster.success(ErrorSuccessMessages.USER_ASSIGNED_SUCCESSFULY);
        this.dialogRef.close();
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }

  async removeUserFromArea(userData: any) {
    try {
      const res = await this.userPremissionsManagmentService.removeUserFromArea(
        this.selectedArea(),
        userData
      );
      if (res) {
        this.toaster.success(ErrorSuccessMessages.USER_REMOVED_SUCCESSFULY);
        this.dialogRef.close();
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }
}
