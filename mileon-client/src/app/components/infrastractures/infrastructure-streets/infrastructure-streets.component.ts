import { Component, signal, inject, effect, DestroyRef, runInInjectionContext, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
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
  InfrastructureFilterOptions,
  StreetsTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
import { AuthorityService } from '../../../services/authority.service ';
import { UploadedFile } from '../../../types/uploadedFile';
import { ToastrService } from 'ngx-toastr';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresSearchComponent } from "../infrastructures-search/infrastructures-search.component";
import { InfrastructuresTableComponent } from "../infrastructures-table/infrastructures-table.component";
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';

@Component({
  selector: 'app-infrastructure-streets',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent
],
  templateUrl: './infrastructure-streets.component.html',
  styleUrls: ['./infrastructure-streets.component.scss'],
})
export class InfrastructureStreetsComponent {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private authorityService = inject(AuthorityService);
  private toaster = inject(ToastrService);
  private routerService = inject(RouterService);
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructureStreetsTitle);
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
  });
  filter = signal<FilterOptions>({
    searchText: '',
    currentPage: 1,
  });
  list = signal<StreetsTypes[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isImportDisabled = signal<boolean>(true);
  streetID = signal<number | null>(null);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  dialogResult = signal<any>(null);
  importDialogResult = signal<any>(null);

  infrastructureForm: FormGroup;

  private authorityEffectRef: any;
  private dialogEffectRef: any;
  private importDialogEffectRef: any;

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

    // Effect to handle dialog form results
    this.dialogEffectRef = effect(() => {
      const result = this.dialogResult();
      if (result) {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        this.handleInsertOrUpdate(result.form, action);
        this.dialogResult.set(null); // Reset after handling
      }
    });

    // Effect to handle import dialog results
    this.importDialogEffectRef = effect(() => {
      const result = this.importDialogResult();
      if (result && result.uploadedFiles) {
        this.filesToUpload.set(result.uploadedFiles);
        this.importData();
        this.importDialogResult.set(null); // Reset after handling
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.StreetsTable);

    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureStreetsForm);
    
    // ✅ Refactored: Use utility to initialize filters
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(this.searchText());
    this.searchData.set(searchData);
    this.filter.set(filter);

    this.authorityService.setMunicipalsToNationalRegional();
  }

  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureStreetsForm;
      }
      
      // ✅ Refactored: Use utility to set authority ID in dialog data
      dialogData = InfrastructuresUtils.setAuthorityInDialogData(
        dialogData,
        this.currentAuthority()
      );
      
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
          isEdit: isEdit,
        },
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

  async importData() {
    // ✅ Refactored: Use utility to handle import data
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.Street,
        this.filesToUpload(),
        this.currentAuthority()!
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          description: InfrastructureEnumDialogs.StreetsDialogDiscription,
        },
      });

      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          const dialogEffectRef = effect(() => {
            const result = dialogResult();
            if (result !== null) {
              this.exportData();
              this.dialog.closeAll();
              // Clean up the effect after use
              dialogEffectRef.destroy();
            }
          });
        }
      });
    }
  }

  async handleInsertOrUpdate(
    streetData: StreetsTypes,
    action: InfrastructureTableAction
  ) {
    try {
      const updatedObject = {
        ...streetData,
        streetID: this.streetID()!,
        authorityID: this.currentAuthority(),
      };

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        new StreetsTypes(updatedObject),
        InfrastructureTablesTypes.Street,
        action
      );
      
      if (result?.success) {
        this.loadData(this.infrastructureSearchFormService.form);
        // ✅ Refactored: Use utility for success handling
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (e) {
      // ✅ Refactored: Use utility for error handling
      InfrastructuresUtils.handleInsertUpdateError(e, this.toaster);
    }
  }

  openEdit(rowData: StreetsTypes) {
    // ✅ Refactored: Use utility for basic mapping, keep custom fromTo logic
    let updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      rowData
    );
    
    // Apply custom logic for fromTo field type
    updatedDialogData = updatedDialogData.map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => {
        if (field.type === 'fromTo') {
          field.fields?.forEach((formField) => {
            if (formField.name === 'from') {
              formField.value = (rowData as any)[field.name]?.from;
            }
            if (formField.name === 'to') {
              formField.value = (rowData as any)[field.name]?.to;
            }
          });
        }
        return field;
      }),
    }));
    
    this.dialogData.set(updatedDialogData);
    this.streetID.set(rowData.streetID);
    this.openDialogForm(true);
  }

  private lastLoadTime = 0;

  async loadData(filter: any) {
    // ✅ Refactored: Use utility for debouncing
    if (InfrastructuresUtils.shouldDebounce(this.lastLoadTime)) {
      return;
    }
    this.lastLoadTime = Date.now();

    this.loader.set(true);
    // ✅ Refactored: Use utility to normalize filter
    filter = InfrastructuresUtils.normalizeFilter(filter);
    
    const startTime = Date.now();
    
    try {
      const searchText = this.infrastructureSearchFormService.form.value.searchText;
      
      // ✅ Refactored: Use utility to prepare filters
      const updatedFilter = InfrastructuresUtils.prepareLoadDataFilters(
        this.filter(),
        filter,
        searchText
      );

      this.filter.set(updatedFilter);
      
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Street,
        this.currentAuthority()
      );
      
      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);

      const trimmedSearchText = searchText?.trim() || '';

      // ✅ Refactored: Use utility to check import disabled state
      this.isImportDisabled.set(
        InfrastructuresUtils.shouldDisableImport(this.data().length, trimmedSearchText)
      );
    } catch (e) {
      // ✅ Refactored: Use utility for error handling
      InfrastructuresUtils.handleError(e, 'loadData');
    }
    
    // ✅ Refactored: Use utility for minimum loader time
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }

  async exportData(): Promise<void> {
    const searchText = this.infrastructureSearchFormService.form.value.searchText;
    
    // ✅ Refactored: Use utility to prepare export filters
    const filters = InfrastructuresUtils.prepareExportFilters(searchText, {
      authorityID: this.currentAuthority(),
    });

    // ✅ Refactored: Use utility to handle export
    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.Street,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }

  back() {
    this.routerService.back();
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          description: InfrastructureEnumDialogs.StreetsDialogImportDiscription,
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

}
