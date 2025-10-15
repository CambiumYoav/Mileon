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
import { Utils } from '../../../utils/utils';
import { AuthorityService } from '../../../services/authority.service ';
import { UploadedFile } from '../../../types/uploadedFile';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresSearchComponent } from "../infrastructures-search/infrastructures-search.component";
import { InfrastructuresTableComponent } from "../infrastructures-table/infrastructures-table.component";
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

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
    
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });

    this.authorityService.setMunicipalsToNationalRegional();
  }

  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      for (const row of dialogData) {
        for (const field of row.row) {
          if (field.name === 'authorityID') {
            field.value = this.currentAuthority();
            break;
          }
        }
      }
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureStreetsForm;

        for (const row of dialogData) {
          for (const field of row.row) {
            if (field.name === 'authorityID') {
              field.value = this.currentAuthority();
              break;
            }
          }
        }
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
          isEdit: isEdit,
        },
      });
      
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogResult.set(result);
        }
      });
    }
  }

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Street,
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
      console.error(e);
    }
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

  openEdit(rowData: StreetsTypes) {
    this.dialogData.set(this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if (field.type === 'fromTo') {
          field.fields?.forEach((formField) => {
            formField.name === 'from'
              ? (formField.value = (rowData as any)[field.name]?.from)
              : '';
            formField.name === 'to'
              ? (formField.value = (rowData as any)[field.name]?.to)
              : '';
          });
        }
        if ((rowData as any)[field.name] !== undefined) {
          return { ...field, value: (rowData as any)[field.name] };
        }
        return field;
      });
      return dynamicRow;
    }));
    this.streetID.set(rowData.streetID);
    this.openDialogForm(true);
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
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Street,
        this.currentAuthority()
      );
      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);

      const searchText =
        this.infrastructureSearchFormService.form.value.searchText?.trim() ||
        '';

      // Set `isImportDisabled` based on the conditions
      this.isImportDisabled.set(
        this.data().length === 0
          ? searchText !== '' // Disable if no data and there is search text
          : true // Enable if there is data
      );
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

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      authorityID: this.currentAuthority(),
    };
    const tableName = InfrastructureTablesTypes.Street;
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

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.importDialogResult.set(result);
        } else {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }

}
