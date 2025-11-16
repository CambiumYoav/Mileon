import {
  Component,
  Input,
  inject,
  signal,
  effect,
  computed,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { Column } from '../../../types/table';
import { User } from '../../../types/user';
import { InventoryManagementService } from '../inventory-management.service';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { Utils } from '../../../utils/utils';
import { InventoryManagementEditComponent } from '../inventory-management-edit/inventory-management-edit.component';
import { InventoryForms } from '../../../types/inventory-management/inventoryForms';
import { InventoryManagementTable } from '../../../types/inventory-management/inventory-management-table.model';
import { InventoryManagementAddComponent } from '../inventory-management-add/inventory-management-add.component';
import { InventoryManagementSearchService } from '../inventory-management-search/inventory-management-search.service';
import { AuthorityService } from '../../../services/authority.service ';
import { UsersFilterOptions } from '../../../types/users/usersFilterOptions';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { InventoryManagementSearchComponent } from '../inventory-management-search/inventory-management-search.component';
import { InventoryManagementTableComponent } from '../inventory-management-table/inventory-management-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AppModalComponent } from '../../shared/app-modal/app-modal.component';

@Component({
  selector: 'app-inventory-management-main',
  templateUrl: './inventory-management-main.component.html',
  styleUrls: ['./inventory-management-main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    InventoryManagementSearchComponent,
    InventoryManagementTableComponent,
    ButtonComponent,
    AppModalComponent,
  ],
})
export class InventoryManagementMainComponent {
  private readonly inventoryManagementSearchFormService = inject(
    InventoryManagementSearchService
  );
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly dialog = inject(MatDialog);
  private readonly inventoryManagementService = inject(
    InventoryManagementService
  );

  readonly title = TitlesEnum.InventoryManagementTitle;
  readonly Icons = ConstPath;
  readonly columns: Column[] = new InventoryManagementTable()
    .InventoryMainColumns;
  readonly exportModalTitle = ModalMessages.EXPORT_FILE;
  readonly modalButtons: ModalButton[] = this.createModalButtons();

  readonly data = signal<any[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly searchText = signal<string>('');
  readonly list = signal<User[]>([]);
  readonly dialogData = signal<DynamicRow[]>(
    new InventoryForms().InventoryForm
  );
  readonly loader = signal<boolean>(true);
  readonly isExportModalOpen = signal<boolean>(false);
  readonly isDialogOpen = signal<boolean>(false);

  @Input() filters: FilterOptions = { currentPage: 1 };

  readonly inventoryManagementForm: FormGroup =
    this.inventoryManagementSearchFormService.searchForm;

  readonly searchData: UsersFilterOptions = {
    searchText: this.searchText(),
    order: 1,
    currentPage: 1,
    pageSize: 100,
  };

  filter: FilterOptions = { currentPage: 1 };

  readonly currentAuthority = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });

  constructor() {
    effect(() => {
      const authority = this.currentAuthority();
      if (authority !== null) {
        this.loadData(this.inventoryManagementSearchFormService.form.value);
      }
    });
  }

  async loadData(filter: any): Promise<void> {
    this.loader.set(true);

    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      this.filter = { ...filter };
      this.filter.searchText =
        this.inventoryManagementSearchFormService.form.value.searchText;
      const updatedFilter = {
        ...this.filter,
        ...filter.value,
        authorityID: this.currentAuthority(),
      };
      const response = await this.inventoryManagementService.getDevices(
        updatedFilter
      );

      if (response?.data) {
        const mappedData = response.data.map((item: any) => {
          const divisionName =
            item.divisions?.map((d: any) => d.name).join(', ') ?? '';
          return {
            ...item,
            divisionName,
          };
        });

        this.data.set(mappedData);
        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
    } catch (e) {
      console.error(e);
    }
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }

  exportDevices(): void {
    const authority = this.currentAuthority();
    if (!authority) return;

    this.inventoryManagementService
      .exportDevices(this.filter.searchText || '', authority)
      .then((fileBlob) => {
        const fileName = `מלאי-${new Date().toISOString().slice(0, 10)}.xlsx`;
        const file = new File([fileBlob], fileName, {
          type: FileTypeExtension.XLSX,
        });
        Utils.saveFile(file);
      })
      .catch((error) => console.error('Error while exporting data:', error));
  }

  openDialogForm(isEdit: boolean = false): void {
    const dialogRef = this.dialog.open(InventoryManagementAddComponent, {
      width: '835px',
      autoFocus: false,
      disableClose: true,
      data: {
        form: new InventoryForms().CreateInventoryForm,
        title: 'הוספת רשומה',
        isEdit,
      },
    });

    // Subscribe to dialog result - will auto-unsubscribe when complete
    dialogRef.componentInstance.dataSubject.subscribe(async (result) => {
      console.log(result.form);

      const noAuthority =
        !result.form.authorityId || result.form.authorityId.trim() === '';

      if (noAuthority) {
        result.form.authorityId = '11111111-1111-1111-1111-111111111111';
        result.form.roleId = 386;
        delete result.form.divisionIds;
      }

      if (!noAuthority && result.form.divisionIds) {
        if (!Array.isArray(result.form.divisionIds)) {
          result.form.divisionIds = [
            ...result.form.divisionIds
              .toString()
              .split(',')
              .map((id: string) => parseInt(id.trim(), 10))
              .filter((v: number) => !isNaN(v)),
          ];
        } else {
          result.form.divisionIds = result.form.divisionIds
            .toString()
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10))
            .filter((v: number) => !isNaN(v));
        }
      }

      const res = await this.inventoryManagementService.createDevice(
        result.form
      );

      if (res.success) {
        this.toaster.success(ErrorSuccessMessages.DEVICE_ADDED_SUCCESSFULY);
        this.loadData(this.inventoryManagementSearchFormService.form.value);
        this.dialog.closeAll();
      }
    });
  }

  openDialogFormEdit(
    isEdit: boolean,
    deviceId: string,
    divisionIds?: string
  ): void {
    if (this.isDialogOpen()) return;
    this.isDialogOpen.set(true);

    const dialogRef = this.dialog.open(InventoryManagementEditComponent, {
      width: '835px',
      autoFocus: false,
      disableClose: true,
      data: {
        form: this.dialogData(),
        title: 'עריכת רשומה',
        isEdit,
        deviceId,
        divisionIds,
      },
    });

    // Subscribe to dialog result
    dialogRef.componentInstance.dataSubject.subscribe(async (result) => {
      let formData = { ...result.form };

      if (!formData.authorityId || formData.authorityId.trim() === '') {
        formData.authorityId = '11111111-1111-1111-1111-111111111111';
        formData.roleId = 386;
        result.form.divisionIds = [result.form.divisionIds];
      }

      if (!formData.inspectorId || formData.inspectorId === '') {
        delete formData.inspectorId;
      }

      if (!formData.divisionIds || formData.divisionIds === '') {
        delete formData.divisionId;
      }

      if (!Array.isArray(result.form.divisionIds)) {
        result.form.divisionIds = [
          result.form.divisionIds
            ?.toString()
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10)),
        ];
      }
      if (Array.isArray(result.form.divisionIds)) {
        result.form.divisionIds = result.form.divisionIds
          ?.toString()
          .split(',')
          .map((id: string) => parseInt(id.trim(), 10));
      }

      console.log(formData);
      const res = await this.inventoryManagementService.updateDeviceById(
        formData
      );

      if (res.success) {
        this.toaster.success(ErrorSuccessMessages.DEVICE_EDITED_SUCCESSFULY);
        this.loadData(this.inventoryManagementSearchFormService.form.value);
        this.dialog.closeAll();
        this.isDialogOpen.set(false);
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpen.set(false);
    });
  }

  openEdit(rowData: any): void {
    if (rowData.iconName) {
      rowData = rowData.item;
    }

    const divisionIds = rowData.divisions?.map((d: any) => d.id) ?? [];

    const updatedDialogData = this.dialogData().map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => {
        if (field.name === 'divisionId') {
          return { ...field, value: divisionIds };
        }

        return rowData[field.name] !== undefined
          ? { ...field, value: rowData[field.name] }
          : field;
      }),
    }));

    this.dialogData.set(updatedDialogData);
    this.openDialogFormEdit(true, rowData.deviceId, divisionIds);
  }

  createModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeExportModal(),
        buttonClass: 'secondary-btn outline-btn',
      },
      { label: 'ייצוא', action: () => this.exportDevices() },
    ];
  }

  closeExportModal(): void {
    this.isExportModalOpen.set(false);
  }

  openExportModal(): void {
    this.isExportModalOpen.set(true);
  }
}
