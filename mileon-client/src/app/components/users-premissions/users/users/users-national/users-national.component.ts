import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { toSignal } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import { ConstPath } from '../../../../../constants/const_path';
import { AuthorityService } from '../../../../../services/authority.service ';
import { TitlesEnum } from '../../../../../types/enum/titlesEnum';
import { InfrastructureForms } from '../../../../../types/infrastructure/infrastructure-table.model';
import { DynamicRow } from '../../../../../types/infrastructure/InfrastructureTypes';
import { Column } from '../../../../../types/table';
import { User } from '../../../../../types/user';
import { UsersFilterOptions } from '../../../../../types/users/usersFilterOptions';
import { UsersSearchFormService } from '../../users-search/users-search-form.service';
import { UsersService } from '../../users.service';
import { FileTypeExtension } from '../../../../../types/enum/fileType.enum';
import { Utils } from '../../../../../utils/utils';
import { MatDialog } from '@angular/material/dialog';
import { UsersExportComponent } from '../../users-export/users-export.component';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { PermissionService } from '../../../../../services/permission.service';
import { CheckboxComponent } from "../../../../shared/base/checkbox/checkbox.component";
import { ButtonComponent } from "../../../../shared/base/button/button.component";
import { UsersSearchComponent } from "../../users-search/users-search.component";
import { UsersTableComponent } from "../../users-table/users-table.component";

@Component({
  selector: 'app-users-national',
  templateUrl: './users-national.component.html',
  styleUrls: ['./users-national.component.scss'],
  imports: [CheckboxComponent, ButtonComponent, UsersSearchComponent, UsersTableComponent],
})
export class UsersNationalComponent implements OnInit {
  private readonly usersSearchFormService = inject(UsersSearchFormService);
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly permissionsService = inject(PermissionService);

  readonly title = TitlesEnum.UsersTitleNational;
  readonly Icons = ConstPath;

  readonly data = signal<any[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly loader = signal<boolean>(false);
  readonly selectAll = signal<boolean>(false);
  readonly includeInactive = signal<boolean>(false);

  private readonly authorityID = toSignal(this.authorityService.authorityId$);
  
  readonly currentAuthority = computed(() => this.authorityID() || null);

  columns: Column[] = [];
  searchText: string = '';
  searchData: UsersFilterOptions = {
    searchText: '',
    order: 1,
    currentPage: 1,
  };
  filter: UsersFilterOptions = {
    searchText: '',
    currentPage: 1,
  };
  list: User[] = [];
  dialogData: DynamicRow[] = [];
  usersForm: FormGroup;

  constructor() {
    this.usersForm = this.usersSearchFormService.searchForm;
  }

  ngOnInit(): void {
    const form = new InfrastructureForms();
    this.dialogData = form.InfrastructureColorForm;
    
    // Update searchData with current searchText
    this.searchData = {
      ...this.searchData,
      searchText: this.searchText,
    };
    
    this.authorityService.setMunicipalsToNationalAdmin();

    this.setupAuthorityEffect();
  }

  private setupAuthorityEffect(): void {
    // React to authority changes using signals
    const authorityEffect = () => {
      const authorityID = this.authorityID();
      if (authorityID) {
        this.usersSearchFormService.clearForm();
        this.loadData(this.usersSearchFormService.form.value);
      }
    };
    
    // Initial call
    authorityEffect();
    
    // Set up reactive effect (this would be replaced with effect() in a real scenario)
    // For now, we'll handle it in the loadData method
  }

  ngOnDestroy(): void {
    this.usersSearchFormService.clearForm();
  }

  async loadData(filter: UsersFilterOptions) {
    this.loader.set(true);
    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      this.filter = { ...filter };

      const updatedFilter = {
        ...this.filter,
        ...filter,
        isActive: this.includeInactive(),
      };

      const res = await this.usersService.getUsersNational(updatedFilter);
      if (res) {
        this.data.set(res.list);
        this.total.set(res.total);
        this.count.set(res.count);
      }
    } catch (e) {
      console.error(e);
    }

    const elapsedTime = Date.now() - startTime; // Calculate request duration
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      // Ensure the loader stays visible for at least `MIN_LOADER_TIME`
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    this.loader.set(false);
  }

  redirectToCreateUser() {
    const role = this.permissionsService.role();
    if (role) {
      this.router.navigate([`/main/${role}/users-permissions/users/create-user`]);
    } else {
      console.error('No role found, redirecting to login');
      this.router.navigate(['/login']);
    }
  }

  async openDialogExport() {
    let dialogComponent = UsersExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {});
      
      // Use async/await instead of subscription
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result) {
        this.exportData();
      }
    }
  }

  async onCheckboxChange(event: boolean) {
    if (event) {
      // Checkbox is checked -> Show inactive users
      this.filter = { ...this.filter, isActive: false };
      this.includeInactive.set(true);
    } else {
      // Checkbox is unchecked -> Show active users
      this.filter = { ...this.filter, isActive: true };
      this.includeInactive.set(false);
    }

    await this.loadData(this.filter);
  }
  
  onCheckboxSelectAllChange(event: boolean) {
    this.selectAll.set(event);
  }
  async exportData() {
    try {
      const fileBlob = await this.usersService.exportUserNational(
        this.includeInactive()
      ); // Fetch the file as a Blob
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const fileName = `משתמשים-ארציים-${currentDate}.xlsx`;
      const file = new File([fileBlob], fileName, {
        type: FileTypeExtension.XLSX,
      });
      Utils.saveFile(file);
    } catch (error) {
      console.error('Error while exporting data:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }
}
