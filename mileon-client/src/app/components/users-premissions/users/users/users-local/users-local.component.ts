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
import { UsersImportComponent } from '../../users-import/users-import.component';
import { UploadedFile } from '../../../../../types/uploadedFile';
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { UsersAfterImportComponent } from '../../users-after-import/users-after-import.component';
import { PermissionService } from '../../../../../services/permission.service';
import { ButtonComponent } from "../../../../shared/base/button/button.component";
import { CheckboxComponent } from "../../../../shared/base/checkbox/checkbox.component";
import { UsersTableComponent } from "../../users-table/users-table.component";
import { UsersSearchComponent } from "../../users-search/users-search.component";

@Component({
  selector: 'app-users-local',
  templateUrl: './users-local.component.html',
  styleUrls: ['./users-local.component.scss'],
  standalone: true,
  imports: [ButtonComponent, CheckboxComponent, UsersTableComponent, UsersSearchComponent],
})
export class UsersLocalComponent implements OnInit {
  private readonly usersSearchFormService = inject(UsersSearchFormService);
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly dialog = inject(MatDialog);
  private readonly permissionsService = inject(PermissionService);

  readonly title = TitlesEnum.UsersTitleLocal;
  readonly Icons = ConstPath;

  readonly data = signal<any[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly loader = signal<boolean>(false);
  readonly selectAll = signal<boolean>(false);
  readonly includeInactive = signal<boolean>(false);
  readonly filesToUpload = signal<UploadedFile[]>([]);
  readonly totalRecords = signal<string>('');
  readonly successfulRecords = signal<string>('');
  readonly errorRecords = signal<string>('');
  readonly fileForFailedUsers = signal<string>('');
  readonly fileNameForFailedUsers = signal<string>('');

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
    const form = new InfrastructureForms(); // users form
    this.dialogData = form.InfrastructureColorForm;
    
    this.searchData = {
      ...this.searchData,
      searchText: this.searchText,
    };

    this.setupAuthorityEffect();
  }

  private setupAuthorityEffect(): void {
    const authorityEffect = () => {
      const authorityID = this.authorityID();
      if (authorityID) {
        this.usersSearchFormService.clearForm();
        this.loadData(this.usersSearchFormService.form.value);
      }
    };
    
    authorityEffect();
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

      const currentAuth = this.currentAuthority();
      if (currentAuth) {
        const res = await this.usersService.getUsersLocal(
          currentAuth,
          updatedFilter
        );
        if (res) {
          this.data.set(res.list);
          this.total.set(res.total);
          this.count.set(res.count);
        }
      }
    } catch (e) {
      console.error(e);
    }
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
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

  async openDialogImport() {
    let dialogComponent = UsersImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {});
      
      // Use async/await instead of subscription
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result && result.uploadedFiles) {
        // Process the returned files (e.g., save them, pass them to a service, etc.)
        this.filesToUpload.set(result.uploadedFiles);

        // Call the importData function to process the uploaded files
        this.importData();
      } else {
        console.log('Dialog was closed without uploading files.');
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
      const fileBlob = await this.usersService.exportUserLocal(
        this.includeInactive(),
        this.currentAuthority() ?? ''
      ); // Fetch the file as a Blob
      const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
      const fileName = `משתמשים${currentDate}.xlsx`;
      const file = new File([fileBlob], fileName, {
        type: FileTypeExtension.XLSX,
      });
      Utils.saveFile(file);
    } catch (error) {
      console.error('Error while exporting data:', error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async importData() {
    try {
      const currentAuth = this.currentAuthority();
      if (!currentAuth) return;
      
      const uploadedFiles = this.filesToUpload();
      if (uploadedFiles.length === 0) return;
      
      const res = await this.usersService.importUsersLocal(
        uploadedFiles[0].file, // Extract the File object from UploadedFile
        currentAuth
      );

      if (!res) {
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
        return;
      }

      // Update records data
      this.successfulRecords.set(res.successfulUsers);
      this.errorRecords.set(res.failedUsers);
      this.totalRecords.set(res.totalUsers);
      this.fileForFailedUsers.set(res.fileContent);
      this.fileNameForFailedUsers.set(res.fileName);

      if (res.errors) {
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);

        this.loadData(this.usersSearchFormService.form.value);
      } else {
        this.loadData(this.usersSearchFormService.form.value);
        this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
      }

      this.openAfterImportPopup();
    } catch (error) {
      console.error(error);
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    }
  }

  async openAfterImportPopup(): Promise<void> {
    this.dialog.closeAll();
    let dialogComponent = UsersAfterImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          totalRecords: this.totalRecords(),
          successfulRecords: this.successfulRecords(),
          errorRecords: this.errorRecords(),
        },
      });
      // Use async/await instead of subscription
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result && result.isDownloadReport) {
        Utils.saveBase64File(
          this.fileForFailedUsers(),
          this.fileNameForFailedUsers()
        );
      }
      
      this.dialog.closeAll();
    }
  }
}
