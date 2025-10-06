import { Component, Inject, OnInit, signal, computed, effect } from '@angular/core';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path';
import { Column } from '../../../../types/table';
import { TableService } from '../../../../components/shared/table/table.service';
import { UserPremissionsManagmentTable } from '../../../../types/user-permissions/user-permissions-table.model';
import { UsersFilterOptions } from '../../../../types/users/usersFilterOptions';
import { User } from '../../../../types/user';
import { FormGroup } from '@angular/forms';
import { UsersPermissionsManagementSearchFormService } from '../users-permissions-management-search/users-permissions-management-search-form.service';
import { UserPremissionsManagmentService } from '../user-premissions-managment.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { SearchByTextEnum } from '../../../../types/enum/searchByTextEnum';
import { UsersPermissionsManagementSearchComponent } from "../users-permissions-management-search/users-permissions-management-search.component";
import { UserPremissionsAssignedTableComponent } from "../user-premissions-assigned-table/user-premissions-assigned-table.component";

@Component({
  selector: 'app-users-permissions-management-assigned',
  templateUrl: './users-permissions-management-assigned.component.html',
  styleUrls: ['./users-permissions-management-assigned.component.scss'],
  standalone: true,
  providers: [TableService],
  imports: [UsersPermissionsManagementSearchComponent, UserPremissionsAssignedTableComponent],
})
export class UsersPermissionsManagementAssignedComponent implements OnInit {
  SearchByTextEnum = SearchByTextEnum;
  
  columns = signal<Column[]>([]);
  tableData = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  Icons = ConstPath;
  title = signal<string>('');
  searchText = signal<string>('');
  searchData = signal<UsersFilterOptions>(new UsersFilterOptions());
  list = signal<User[]>([]);
  form: FormGroup;
  selectedArea = signal<any>(null);
  
  refreshTrigger = signal<string>('');

  constructor(
    public dialogRef: MatDialogRef<UsersPermissionsManagementAssignedComponent>,
    private dialog: MatDialog,
    private toaster: ToastrService,
    private usersPermissionsManagementSearchFormService: UsersPermissionsManagementSearchFormService,
    private userPremissionsManagmentService: UserPremissionsManagmentService,
    @Inject(MAT_DIALOG_DATA)
    public data: { tableData: any[]; areaName: string; areaID: string }
  ) {
    this.form = usersPermissionsManagementSearchFormService.searchForm;
    this.title.set(data?.areaName || '');
    this.tableData.set(data?.tableData || []);
    this.selectedArea.set(data?.areaID);
  }

  ngOnInit(): void {
    const tableColumns = new UserPremissionsManagmentTable();
    this.columns.set(tableColumns.AssignedUsersColumns);

    // Initialize with first page of data
    const initialFilter = {
      value: {
        currentPage: 1,
        pageSize: 10,
        order: 1,
        orderByField: '',
        searchText: ''
      }
    };
    
    this.loadData(initialFilter);
  }


  ngOnDestroy(): void {
    this.usersPermissionsManagementSearchFormService.clearForm();
  }

  async loadData(filter?: any) {
    if (filter && filter.value) {
      const { currentPage, pageSize, order, orderByField, searchText } =
        filter.value;

      // Get the original data (from constructor injection)
      const originalData = this.data?.tableData || [];
      
      // Step 1: Filter data based on searchText
      let filteredData = [...originalData];
      if (searchText) {
        const searchLower = searchText.toLowerCase();
        filteredData = filteredData.filter((item) => {
          // Modify fields to include all searchable fields
          return (
            item.lastName?.toLowerCase().includes(searchLower) ||
            item.firstName?.toLowerCase().includes(searchLower) ||
            item.userNID?.toLowerCase().includes(searchLower)
          );
        });
      }

      // Step 2: Sort the filtered data
      const sortedData = this.sortData(filteredData, orderByField, order);

      // Step 3: Paginate the sorted data
      const startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = sortedData.slice(startIndex, endIndex);

      // Step 4: Update the table data using signals - FIXED: Use paginated data
      this.tableData.set(paginatedData); // ✅ FIXED: Set paginated data, not all data
      this.total.set(filteredData.length); // Total records after filtering
    }
  }

  // async loadData(filter?: any) {
  //   console.log('Filter', filter);
  //   if (filter && filter.value) {
  //     const { currentPage, pageSize, order, orderByField } = filter.value;
  //     console.log('Sorting by field:', orderByField, 'with order:', order);

  //     // Step 1: Sort the data
  //     const sortedData = this.sortData([...this.mockData], orderByField, order);
  //     console.log('Sorted Data', sortedData);
  //     // Step 2: Paginate the sorted data
  //     const startIndex = (currentPage - 1) * pageSize;
  //     const endIndex = startIndex + pageSize;
  //     const paginatedData = sortedData.slice(startIndex, endIndex);
  //     console.log(paginatedData);
  //     this.tableData = paginatedData;
  //     this.total = this.mockData.length; // Total records
  //   }
  //   // Step 3: Update the table data
  //   try {
  //     // const res = await this.usersService.getUsersNational(filter);
  //     // if (res) {
  //     //   this.data = res.list;
  //     //   this.total = res.total;
  //     //   this.count = res.count;
  //     // }
  //     //  this.data = result.data.map((d) => ({
  //     //         ticketStatusID: d.stageID,
  //     //         ticketStatusName: d.name,
  //     //       }));

  //     console.log('Table Data', this.tableData);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  onSubmit() {
    this.refreshTrigger.set('');
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  async removeUser(user: any) {
    const userDataObject = [user.user.userID];
    try {
      const res = await this.userPremissionsManagmentService.removeUserFromArea(
        this.selectedArea(),
        userDataObject
      );
      if (res) {
        this.toaster.success(ErrorSuccessMessages.USER_REMOVED_SUCCESSFULY);
        this.refreshTrigger.set('close');
        this.dialogRef.close();
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(e);
    }
  }

  sortData(data: any[], orderByField: string, order: number): any[] {
    return data.sort((a, b) => {
      const valueA = a[orderByField] ?? ''; // Default to empty string
      const valueB = b[orderByField] ?? '';

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Compare strings (case-insensitive)
        return order * valueA.toLowerCase().localeCompare(valueB.toLowerCase());
      }
      // Compare numbers or other types
      return order * (valueA > valueB ? 1 : valueA < valueB ? -1 : 0);
    });
  }
}
