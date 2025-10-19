import { Component, signal, inject, effect, runInInjectionContext, Injector } from '@angular/core';
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
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
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
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

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
  private injector = inject(Injector);

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
    
    // Initialize search and filters using utility
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    
    this.searchData.set({
      ...searchData,
      authorityID: this.currentAuthority() || undefined,
    });
    this.filter.set(filter);

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

      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result !== undefined) {
            if (result) {
              this.importDialogResult.set(result);
            } else {
              console.log('Dialog was closed without uploading files.');
            }
            dialogEffectRef.destroy();
          }
        });
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
      
      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result) {
            this.dialogResult.set(result);
            dialogEffectRef.destroy();
          }
        });
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
      
      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result) {
            this.exportDialogResult.set(result);
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }

  async importData() {
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.Business,
        this.filesToUpload(),
        this.currentAuthority()!
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { authorityID: this.currentAuthority() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.Business,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
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
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (error) {
      InfrastructuresUtils.handleInsertUpdateError(error, this.toaster);
    }
  }

  back() {
    this.routerService.back();
  }

  openEdit(rowData: BusinessType) {
    // Store the business ID for update operations
    this.businessID.set(rowData.id || null);
    
    // Update dialog data with the row data using utility
    const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      rowData
    );
    this.dialogData.set(updatedDialogData);
    
    this.openDialogForm(true);
  }

  onIconEvent(rowData: Citizen) {
    //send this to server?
    console.log(rowData);
  }

  private lastLoadTime = 0;

  async loadData(filter: any) {
    // Debounce rapid successive calls using utility
    if (InfrastructuresUtils.shouldDebounce(this.lastLoadTime)) {
      return;
    }
    this.lastLoadTime = Date.now();

    this.loader.set(true);
    
    // Normalize filter using utility
    filter = InfrastructuresUtils.normalizeFilter(filter);
    
    const startTime = Date.now();
    
    try {
      const searchText = this.infrastructureSearchFormService.form.value.searchText;
      
      // Prepare filters using utility
      const updatedFilter = InfrastructuresUtils.prepareLoadDataFilters(
        this.filter(),
        filter,
        searchText
      );
      
      this.filter.set(updatedFilter);
      
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Business,
        this.currentAuthority()
      );
      
      if (response?.data) {
        // Process data with formatted address using utility
        const processedData = InfrastructuresUtils.processDataWithFormattedAddress(
          response.data,
          (item: any) => {
            const street = item.street || '';
            const houseNumber = item.houseNumber || '';
            const apartment = item.apartment ? `, דירה ${item.apartment}` : '';
            return `${street} ${houseNumber}${apartment}`.trim();
          }
        );

        this.data.set(processedData);
        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
    } catch (error) {
      InfrastructuresUtils.handleError(error, 'loadData');
    }
    
    // Ensure minimum loader time using utility
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }

}
