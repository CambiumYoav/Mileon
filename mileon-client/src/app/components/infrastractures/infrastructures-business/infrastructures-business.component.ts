import { Component, signal, inject, effect, DestroyRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path'; 
import { Citizen } from '../../../types/citizen';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureTable,
  InfrastructureForms,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  BusinessType,
  InfrastructureFilterOptions,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { InfrastructureService } from '../infrastructure.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-business',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent
  ],
  templateUrl: './infrastructures-business.component.html',
  styleUrls: ['./infrastructures-business.component.scss'],
})
export class InfrastructuresBusinessComponent {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private destroyRef = inject(DestroyRef);

  title = signal<string>(TitlesEnum.InfrastructureBusinessTitle);
  Icons = ConstPath;
  SearchByTextEnum = SearchByTextEnum;

  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  searchText = signal<string>('');
  searchData = signal<InfrastructureFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
    authorityID: undefined,
  });
  filter = signal<FilterOptions>({
    searchText: '',
    currentPage: 1,
  });
  list = signal<Citizen[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  fileData = signal<any>(null);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  businessID = signal<number | null>(null);
  dialogResult = signal<any>(null);
  importDialogResult = signal<any>(null);
  exportDialogResult = signal<any>(null);

  infrastructureForm: FormGroup;

  private authorityEffectRef: any;
  private dialogEffectRef: any;
  private importDialogEffectRef: any;
  private exportDialogEffectRef: any;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    const authoritySignal = toSignal(this.authorityService.authorityId$, { initialValue: null });
    
    // Store effect reference for cleanup
    this.authorityEffectRef = effect(() => {
      const authorityID = authoritySignal();
      if (authorityID && authorityID !== this.currentAuthority()) {
        this.currentAuthority.set(authorityID);
        // Only load data if authority actually changed
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });

    this.dialogEffectRef = effect(() => {
      const result = this.dialogResult();
      if (result) {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        this.handleInsertOrUpdate(result, action);
        this.dialogResult.set(null); // Reset after handling
      }
    });

    this.importDialogEffectRef = effect(() => {
      const result = this.importDialogResult();
      if (result && result.uploadedFiles) {
        this.filesToUpload.set(result.uploadedFiles);
        this.importData();
        this.importDialogResult.set(null); // Reset after handling
      }
    });

    this.exportDialogEffectRef = effect(() => {
      const result = this.exportDialogResult();
      if (result) {
        this.exportData();
        this.dialog.closeAll();
        this.exportDialogResult.set(null); // Reset after handling
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.BusinessTable);
    
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureBusinessForm);
    
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
      authorityID: this.currentAuthority() || undefined,
    });
    
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });

    this.authorityService.setMunicipalsToNationalRegional();
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          description:
            InfrastructureEnumDialogs.BusinessDialogImportDiscription,
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.importDialogResult.set(result);
        } else {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }

  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        // Clear business ID for new entries
        this.businessID.set(null);
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureBusinessForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        data: { form: dialogData, title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle, isEdit: isEdit },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.dialogResult.set(result);
        }
      });
    }
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          description:
            InfrastructureEnumDialogs.BusinessDialogExportDiscription,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.exportDialogResult.set(result);
        }
      });
    }
  }

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Business,
          this.filesToUpload(),
          this.currentAuthority()!
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
      console.error('Error import data:', e);
    }
  }

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      authorityID: this.currentAuthority(),
    };
    const tableName = InfrastructureTablesTypes.Business;
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

  async handleInsertOrUpdate(
    newType: BusinessType,
    action: InfrastructureTableAction
  ) {
    try {
      const updatedObject = { 
        ...newType, 
        authorityID: this.currentAuthority(),
        businessID: action === InfrastructureTableAction.Update ? this.businessID() : undefined
      };
      
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        updatedObject,
        InfrastructureTablesTypes.Business,
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
      this.toaster.error(ErrorSuccessMessages.DEFAULT);
      console.error(e);
    }
  }

  back() {
    this.routerService.back();
  }

  openEdit(rowData: BusinessType) {
    // Store the business ID for update operations
    this.businessID.set(rowData.id || null);
    
    // Update dialog data with the row data
    this.dialogData.set(this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if ((rowData as any)[field.name] !== undefined) {
          return { ...field, value: (rowData as any)[field.name] };
        }
        return field;
      });
      return dynamicRow;
    }));
    
    this.openDialogForm(true);
  }

  onIconEvent(rowData: Citizen) {
    //send this to server?
    console.log(rowData);
  }

  private lastLoadTime = 0;
  private readonly LOAD_DEBOUNCE_MS = 500; // Prevent rapid successive calls

  async loadData(filter: any) {
    // Debounce rapid successive calls
    const now = Date.now();
    if (now - this.lastLoadTime < this.LOAD_DEBOUNCE_MS) {
      return;
    }
    this.lastLoadTime = now;

    this.loader.set(true);

    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      this.filter.set({ ...filter });
      this.filter.set({
        ...this.filter(),
        searchText: this.infrastructureSearchFormService.form.value.searchText,
      });

      const updatedFilter = {
        ...this.filter(),
        ...filter.value,
      };
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Business,
        this.currentAuthority()
      );
      if (response?.data) {
        // Optimize data processing to prevent memory issues
        const processedData = response.data.map((item: any) => {
          const street = item.street || '';
          const houseNumber = item.houseNumber || '';
          const apartment = item.apartment ? `, דירה ${item.apartment}` : '';
          
          return {
            ...item,
            fullAddress: `${street} ${houseNumber}${apartment}`.trim(),
          };
        });

        this.data.set(processedData);
        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
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

}
