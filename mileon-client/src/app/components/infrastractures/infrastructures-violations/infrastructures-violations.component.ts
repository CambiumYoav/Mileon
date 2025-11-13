import {
  Component,
  signal,
  computed,
  effect,
  inject,
  OnInit,
  DestroyRef,
  runInInjectionContext,
  Injector,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
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
  ViolationsTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';

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
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import {
  InfrastructureEnumDialogs,
  InfrastructureEnumTitles,
} from '../../../types/enum/infrastructure.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-infrastructures-violations',
  templateUrl: './infrastructures-violations.component.html',
  styleUrls: ['./infrastructures-violations.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
  ],
})
export class InfrastructuresViolationsComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructureViolationsTitle);
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
  list = signal<ViolationsTypes[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isImportDisabled = signal<boolean>(true);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  violationID = signal<any>('');
  dialogResult = signal<any>(null);
  importDialogResult = signal<any>(null);

  authorityID = toSignal(this.authorityService.authorityId$);

  infrastructureForm: FormGroup;

  private destroyRef = inject(DestroyRef);
  private dialogEffectRef: any;
  private importDialogEffectRef: any;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;

    effect(() => {
      const authorityID = this.authorityID();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });

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
    this.columns.set(tableColumns.ViolationsTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureViolationForm);

    const { searchData, filter } =
      InfrastructuresUtils.initializeSearchAndFilters(this.searchText());

    this.searchData.set(searchData);
    this.filter.set(filter);

    this.authorityService.setMunicipalsToNationalRegional();
  }

  back() {
    this.routerService.back();
  }

  async openDialogForm(isEdit: boolean) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureViolationForm;
      }

      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit
            ? InfrastructureEnumTitles.EditDialogTitle
            : InfrastructureEnumTitles.AddDialogTitle,
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

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          description:
            InfrastructureEnumDialogs.ViolationsDialogExportDiscription,
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

  
  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          isSignsImport: false,
          description:
            InfrastructureEnumDialogs.ViolationsDialogImportDiscription,
        },
      });

      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result !== undefined) {
            if (result) {
              this.importDialogResult.set(result);
            }
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }

  async handleInsertOrUpdate(
    newViolation: ViolationsTypes,
    action: InfrastructureTableAction
  ) {
    try {
      newViolation.authorityID = this.authorityService.getAuthorityID();
      const newData = new ViolationsTypes(newViolation);
      if (action === InfrastructureTableAction.Add) {
        delete newData.violationID;
      }
      if (action === InfrastructureTableAction.Update) {
        newData.violationID = this.violationID();
      }
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newData,
        InfrastructureTablesTypes.Violation,
        action
      );
      if (result && result?.success) {
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(
          action,
          this.toaster,
          this.dialog
        );
      }
    } catch (e) {
      InfrastructuresUtils.handleInsertUpdateError(e, this.toaster);
    }
  }

  async importData() {
    await InfrastructuresUtils.handleImportData(
      () =>
        this.infrastructureServer.importDataByTableType(
          InfrastructureTablesTypes.Violation,
          this.filesToUpload(),
          this.currentAuthority()!
        ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  openEdit(rowData: ViolationsTypes) {
    if (rowData.violationID) this.violationID.set(rowData.violationID);
    rowData.ticketTypeID = rowData.ticketType!.ticketTypeID;

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
      const currentFilter = { ...filter };
      currentFilter.searchText =
        this.infrastructureSearchFormService.form.value.searchText;

      this.filter.set(currentFilter);

      const updatedFilter = {
        ...this.filter(),
      };
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Violation,
        this.currentAuthority()
      );

      const processedData = result.data.map((v: any) => ({
        ...v,
        photoRequiredDisplay: v.photoRequired ? 'כן' : 'לא',
        ticketTypeName: v.ticketType?.ticketTypeName,
      }));

      this.data.set(processedData);
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

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { authorityID: this.currentAuthority() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.Violation,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }
}
