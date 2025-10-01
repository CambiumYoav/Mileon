import { Component, OnInit, signal, computed, inject, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PermissionsFilterOptions } from '../../../../types/permission.interface';
import { PermissionGroupCreateComponent } from '../permission-group-create/permission-group-create.component';
import { MatDialog } from '@angular/material/dialog';
import { ConstPath } from '../../../../constants/const_path';
import { AuthorityService } from '../../../../services/authority.service ';
import { PermissionsService } from '../permissions.service';
import { FilterOptions } from '../../../../types/filters/filterOptions';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { PermissionGroupDeleteComponent } from '../permission-group-delete/permission-group-delete.component';
import { RouterService } from '../../../../services/router.service';
import { EditOrDeleteEvent } from '../../../../types/permissions/editOrDeleteEvent';
import { PermissionsSearchFormService } from '../permissions-search/permissions-search-form.service';
import { PermissionsForms } from '../../../../types/user-permissions/user-permissions-table.model';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { TitlesEnum } from '../../../../types/enum/titlesEnum';
import { ModalButton } from '../../../../constants/modalButtons';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { PermissionsSearchComponent } from "../permissions-search/permissions-search.component";
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { PermissionsTableComponent } from "../permissions-table/permissions-table.component";
import { AppModalComponent } from "../../../shared/app-modal/app-modal.component";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PermissionsSearchComponent, ButtonComponent, PermissionsTableComponent, AppModalComponent]
})
export class PermissionsComponent implements OnInit {
  // Injected services
  private readonly permissionsSearchFormService = inject(PermissionsSearchFormService);
  private readonly dialog = inject(MatDialog);
  private readonly authorityService = inject(AuthorityService);
  private readonly permissionService = inject(PermissionsService);
  private readonly routerService = inject(RouterService);
  private readonly toaster = inject(ToastrService);

  // Signals for reactive state
  title = signal<string>(TitlesEnum.GroupPermissionsTitle);
  filter = signal<FilterOptions>({ currentPage: 1 });
  resultData = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  searchText = signal<string>('');
  searchData = signal<PermissionsFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  dialogData = signal<DynamicField[]>([]);
  permissionsSearchForm = signal<FormGroup | null>(null);
  filterHasValue = signal<boolean>(true);
  filterAdvanceHasValue = signal<boolean>(false);
  data = signal<any[]>([]);
  isEdit = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  isDeleteModalOpen = signal<boolean>(false);
  modalTitle = signal<string>('הסרת קבוצה');
  modalButtons = signal<ModalButton[]>(this.createModalButtons());
  loader = signal<boolean>(false);
  dialogFormResult = signal<any>(null);
  editDialogResult = signal<any>(null);
  deleteDialogResult = signal<any>(null);
  currentDeleteElement = signal<any>(null);
  
  // Computed signals
  Icons = ConstPath;
  hasData = computed(() => this.data().length > 0);
  isLoading = computed(() => this.loader());
  canDelete = computed(() => !this.isDeleting());

  constructor() {
    // Use effect to react to authorityId changes
    effect(() => {
      const authorityId = this.authorityService.authorityId();
      if (authorityId) {
        this.filter.update(filter => ({ ...filter, authorityID: authorityId }));
        this.loadGroups(this.permissionsSearchFormService.form().value);
      } else {
        console.error('Authority ID is undefined.');
      }
    });

    // Use effect to react to dialog form results
    effect(() => {
      const formResult = this.dialogFormResult();
      if (formResult) {
        this.addGroup(formResult.form);
        this.dialogFormResult.set(null); // Reset after processing
      }
    });

    // Use effect to react to edit dialog results
    effect(() => {
      const editResult = this.editDialogResult();
      if (editResult) {
        console.log(editResult);
        this.dialog.closeAll();
        this.editDialogResult.set(null); // Reset after processing
      }
    });

    // Use effect to react to delete dialog results
    effect(() => {
      const deleteResult = this.deleteDialogResult();
      if (deleteResult !== null) {
        this.handleDeleteResult(deleteResult);
        this.deleteDialogResult.set(null); // Reset after processing
      }
    });
  }

  ngOnInit(): void {
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });

    const form = new PermissionsForms();
    this.dialogData.set(form.CreateGroupForm);
  }



  async loadGroups(filter: PermissionsFilterOptions) {
    this.loader.set(true);
    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const res = await this.permissionService.getGroups(filter);
      if (res) {
        this.data.set(res.data);
        this.total.set(res.totalRecords);
      }
    } catch (error) {
      console.error(error);
    } finally {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = MIN_LOADER_TIME - elapsedTime;

      if (remainingTime > 0) {
        //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }
      this.loader.set(false);
    }
  }

  async addGroup(body: any) {
    try {
      const res = await this.permissionService.createGroup(body);
      if (res) {
        this.toaster.success(ErrorSuccessMessages.GROUP_CREATED_SUCCESSFULY);
        this.loadGroups(this.permissionsSearchFormService.form().value);
      }
    } catch (error) {
      console.error(error);
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
    }
  }

  onEditOrDelete(event: EditOrDeleteEvent): void {
    switch (event.action) {
      case 'edit':
        this.isEdit.set(true);
        this.editGroup(event.data);
        break;
      case 'delete':
        this.deleteGroup(event.data);
        break;
      default:
        console.warn('Unhandled action:', event.action);
    }
  }

  async openDialogForm(isEdit: boolean = false) {
    const dialogComponent = PermissionGroupCreateComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        width: '835px',
        data: {
          form: this.dialogData(),
          title: 'הוספה / עריכת קבוצה',
          isEdit: isEdit,
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      
      dialogInstance.formData.subscribe((result) => {
        this.dialogFormResult.set(result);
      });
    }
  }

  editGroup(element: any): void {
    console.log('Edit group:', element);
    this.routerService.navigateToPageURL(
      `${ROUTE_PATH.UsersPermissions.Home}/${ROUTE_PATH.UsersPermissions.Management}`
    );
  }
  editGroupDetails(element: any): void {
    const dialogComponent = PermissionGroupCreateComponent;
    if (dialogComponent) {
      console.log(element);
      const dialogRef = this.dialog.open(dialogComponent, {
        width: '835px',
        data: {
          form: this.dialogData(),
          title: 'הוספה / עריכת קבוצה',
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      
      dialogInstance.formData.subscribe((result) => {
        this.editDialogResult.set(result);
      });
    }
  }

  deleteGroup(element: any): void {
    // Add simple debounce to prevent duplicate calls
    if (this.isDeleting()) return;
    this.isDeleting.set(true);

    console.log('Delete group:', element);
    const { assignedUsers, roleID } = element.item;

    if (assignedUsers > 0) {
      this.isDeleteModalOpen.set(true);
      this.isDeleting.set(false);
      return;
    }

    // Store the element being deleted
    this.currentDeleteElement.set(element);

    const dialogRef = this.dialog.open(PermissionGroupDeleteComponent, {
      width: '335px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.deleteDialogResult.set(result);
    });
  }

  async handleDeleteResult(result: any): Promise<void> {
    this.isDeleting.set(false);
    if (result) {
      try {
        const currentElement = this.currentDeleteElement();
        if (currentElement) {
          const { roleID } = currentElement.item;
          const res = await this.permissionService.deleteGroup(roleID);
          if (res) {
            this.toaster.success(
              ErrorSuccessMessages.GROUP_DELETED_SUCCESSFULY
            );
          }
          // Optionally refresh your data here
          this.loadGroups(this.permissionsSearchFormService.form().value);
        }
      } catch (error) {
        // Handle error
        this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      }
    }
  }

  createModalButtons(): ModalButton[] {
    return [{ label: 'סגור', action: () => this.closeDeleteModal() }];
  }
  
  closeDeleteModal(): void {
    this.isDeleteModalOpen.set(false);
  }
}
