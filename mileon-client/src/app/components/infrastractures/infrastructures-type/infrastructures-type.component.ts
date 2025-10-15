import { Component, OnInit, OnDestroy, inject, signal, computed, effect, ChangeDetectionStrategy, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  InfrastructureForms,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import { Column } from '../../../types/table';
import { InfrastructureService } from '../infrastructure.service';
import {
  InfrastructureFilterOptions,
  VehicleType,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ConstPath } from '../../../constants/const_path';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { Utils } from '../../../utils/utils';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { UploadedFile } from '../../../types/uploadedFile';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-type',
  templateUrl: './infrastructures-type.component.html',
  styleUrls: ['./infrastructures-type.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    InfrastructuresSearchComponent,
    CheckboxComponent,
    ButtonComponent,
    InfrastructuresTableComponent,
  ],
})
export class InfrastructuresTypeComponent implements OnInit, OnDestroy {
  private readonly infrastructureServer = inject(InfrastructureService);
  private readonly infrastructureSearchFormService = inject(SearchFormService);
  private readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly routerService = inject(RouterService);
  private readonly injector = inject(Injector);

  readonly title = signal<string>(TitlesEnum.InfrastructureVehicleTitle);
  readonly columns = signal<Column[]>([]);
  readonly data = signal<any[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly searchText = signal<string>('');
  readonly searchData = signal<InfrastructureFilterOptions | undefined>(undefined);
  readonly filter = signal<InfrastructureFilterOptions | undefined>(undefined);
  readonly list = signal<VehicleType[]>([]);
  readonly dialogData = signal<DynamicRow[]>([]);
  readonly infrastructureForm = signal<FormGroup>(this.infrastructureSearchFormService.form);
  readonly filesToUpload = signal<UploadedFile[]>([]);
  readonly loader = signal<boolean>(false);
  readonly includeInactive = signal<boolean>(false);
  readonly currentAuthority = signal<string | null>(null);

  readonly Icons = ConstPath;
  readonly SearchByTextEnum = SearchByTextEnum;
  readonly mviewAuthority = '11111111-1111-1111-1111-111111111111';

  constructor() {
    effect(() => {
      const authority = this.currentAuthority();
      if (authority) {
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
    
    effect(() => {
      this.authorityService.authorityId$.subscribe((authorityID: string | null) => {
        this.currentAuthority.set(authorityID);
      });
    });
  }
  back(): void {
    this.routerService.back();
  }
  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.TypeTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureTypeForm);

    this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  async openDialogForm(isEdit: boolean = false): Promise<void> {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureTypeForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
          isEdit: isEdit,
        },
      });
      // Handle dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          effect(() => {
            const result = dialogResult();
            if (result && typeof result === 'object' && result !== null && 
                'form' in result && 'isEdit' in result) {
              const action = (result as any).isEdit
                ? InfrastructureTableAction.Update
                : InfrastructureTableAction.Add;
              this.handleInsertOrUpdate((result as any).form, action);
            }
          });
        }
      });
    }
  }

  async openDialogExport(): Promise<void> {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,

        data: {
          description: InfrastructureEnumDialogs.TypesDialogExportDiscription,
        },
      });
      // Handle export dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          effect(() => {
            const result = dialogResult();
            if (result) {
              this.exportData();
              this.dialog.closeAll();
            }
          });
        }
      });
    }
  }

  async handleInsertOrUpdate(
    newType: VehicleType,
    action: InfrastructureTableAction
  ): Promise<void> {
    try {
      if (action === InfrastructureTableAction.Add) {
        newType.vehicleTypeID = 0;
      }
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newType,
        InfrastructureTablesTypes.VehicleType,
        action
      );

      if (result && result?.success) {
        this.loadData(this.infrastructureSearchFormService.form);
        this.dialog.closeAll();
        if (action == InfrastructureTableAction.Add) {
          this.toaster.success(ErrorSuccessMessages.ADDED_SUCCESUFULY);
        }
        if (action == InfrastructureTableAction.Update) {
          this.toaster.success(ErrorSuccessMessages.UPDATED_SUCCESUFULY);
        }
      }
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }
  }
  async openDialogImport(): Promise<void> {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          isSignsImport: false,
          description: InfrastructureEnumDialogs.TypesDialogImportDiscription,
        },
      });

      // Convert subscription to async/await pattern
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

  async importData(): Promise<void> {
    try {
      this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.VehicleType,
          this.filesToUpload(),
          this.mviewAuthority
        )
        .then((res) => {
          if (res.errors) {
            this.toaster.error(
              ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
            );
          } else {
            this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
            this.loadData(this.infrastructureSearchFormService.form);
          }
        })
        .catch((error) => {
          this.toaster.error(
            ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
          );
        });
    } catch (e) {
      console.error(e);
    }
  }

  openEdit(rowData: VehicleType): void {
    const updatedDialogData = this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if (rowData[field.name as keyof VehicleType] !== undefined) {
          return { ...field, value: rowData[field.name as keyof VehicleType] };
        }
        return field;
      });
      return dynamicRow;
    });
    this.dialogData.set(updatedDialogData);
    this.openDialogForm(true);
  }

  async loadData(filter: any): Promise<void> {
    this.loader.set(true);
    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const currentFilter = { ...filter };
      currentFilter.searchText = this.infrastructureSearchFormService.form.value.searchText;

      const updatedFilter = {
        ...currentFilter,
        ...filter.value,
        includeInactive: this.includeInactive(),
      };
      
      this.filter.set(updatedFilter);
      
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.VehicleType
      );
      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);
    } catch (e) {
      console.error(e);
      this.loader.set(false);
    }
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      includeInactive: this.includeInactive(),
    };
    const tableName = InfrastructureTablesTypes.VehicleType;
    try {
      await Utils.exportData(
        filters,
        tableName,
        this.infrastructureServer.exportTableData.bind(
          this.infrastructureServer
        )
      );
      this.toaster.success(ErrorSuccessMessages.DOWNLOADED_SUCCESSFULY);
    } catch (e) {
      this.toaster.error(ErrorSuccessMessages.DEFAULT);
      console.error(e);
    }
  }

  async onCheckboxChange(includeInactive: boolean): Promise<void> {
    this.includeInactive.set(includeInactive);

    // Reset filter and update currentPage value
    const newFilter = { currentPage: 1, includeInactive };
    this.filter.set(newFilter);

    await this.loadData(newFilter);
  }
}
