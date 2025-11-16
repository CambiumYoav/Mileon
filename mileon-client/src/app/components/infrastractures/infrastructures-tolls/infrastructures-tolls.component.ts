import { Component, OnInit, signal, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
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
import { InfrastructureFilterOptions } from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { Utils } from '../../../utils/utils';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
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
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-infrastructures-tolls',
  templateUrl: './infrastructures-tolls.component.html',
  styleUrls: ['./infrastructures-tolls.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
    ButtonComponent
  ]
})
export class InfrastructuresTollsComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  readonly title: string = TitlesEnum.InfrastructureTollsTitle;
  readonly Icons = ConstPath;
  readonly SearchByTextEnum = SearchByTextEnum;

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
  list = signal<any[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isImportDisabled = signal<boolean>(true);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);

  infrastructureForm: FormGroup;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    // Convert authority subscription to signal and react to changes
    const authoritySignal = toSignal(this.authorityService.authorityId$, { initialValue: null });
    
    effect(() => {
      const authorityID = authoritySignal();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.TollsTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureTollsForm);
    
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    
    this.searchData.set(searchData);
    this.filter.set(filter);
    
    this.authorityService.setMunicipalsToNationalRegional();
  }

  async openDialogForm(isEdit: boolean) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureTollsForm;
      }
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
            const action = isEdit
              ? InfrastructureTableAction.Update
              : InfrastructureTableAction.Add;
            this.handleInsertOrUpdate(result.form, action);
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }

  back() {
    this.routerService.back();
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          description: InfrastructureEnumDialogs.TollsDialogExportDiscription,
        },
      });

      dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((res) => {
        if (res?.confirmed) this.exportData();
      });
  
    }
  }

  async handleInsertOrUpdate(newType: any, action: InfrastructureTableAction) {
    try {
      const transformedType = {
        ...newType,
        authorityID: this.currentAuthority(),
      };
      if (action === InfrastructureTableAction.Add) {
        delete transformedType.id;
      }

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        transformedType,
        InfrastructureTablesTypes.Fees,
        action
      );
      if (result && result?.success) {
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (e) {
      InfrastructuresUtils.handleInsertUpdateError(e, this.toaster);
    }
  }

  openEdit(rowData: any) {
    const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      rowData
    );
    this.dialogData.set(updatedDialogData);
    
    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    this.loader.set(true);
    
    filter = InfrastructuresUtils.normalizeFilter(filter);

    const startTime = Date.now();
    try {
      this.filter.set({ ...filter });
      this.filter.update(current => ({
        ...current,
        searchText: this.infrastructureSearchFormService.form.value.searchText,
      }));

      const updatedFilter = {
        ...this.filter(),
      };
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Fees,
        this.currentAuthority()
      );

      this.data.set(result.data.map((fee: any) => {
        return {
          ...fee,
          feeTypeName: fee.feeType?.name,
        };
      }));

      this.total.set(result.totalRecords);
      this.count.set(result.data.length);

      const searchText =
        this.infrastructureSearchFormService.form.value.searchText?.trim() ||
        '';

      this.isImportDisabled.set(
        InfrastructuresUtils.shouldDisableImport(this.data().length, searchText)
      );
    } catch (e) {
      InfrastructuresUtils.handleError(e, 'loadData');
    }
    
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          isSignsImport: false,
          description: InfrastructureEnumDialogs.TollsDialogImportDiscription,
        },
      });

      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result !== undefined) {
            if (result && result.uploadedFiles) {
              // Process the returned files (e.g., save them, pass them to a service, etc.)
              this.filesToUpload.set(result.uploadedFiles);

              // Call the importData function to process the uploaded files
              this.importData();
            }
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }
  async importData() {
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.Fees,
        this.filesToUpload(),
        this.currentAuthority()!
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form.value)
    );
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { authorityID: this.currentAuthority() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.Fees,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }
}
