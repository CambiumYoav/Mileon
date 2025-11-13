import { Component, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
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
import {
  InfrastructureTable,
  InfrastructureForms,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  PlaintiffsCausesTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { TicketTypeDisplayEnum } from '../../../types/enum/ticketEnums';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';
import { take } from 'rxjs';

@Component({
  selector: 'app-infrastructures-plaintiffs-causes',
  templateUrl: './infrastructures-plaintiffs-causes.component.html',
  styleUrls: ['./infrastructures-plaintiffs-causes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ButtonComponent,
    CheckboxComponent,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent
  ]
})
export class InfrastructuresPlaintiffsCausesComponent {
  private infrastructureServer = inject(InfrastructureService);
  private dialog = inject(MatDialog);
  private infrastructureSearchFormService = inject(SearchFormService);
  private searchFormService = inject(SearchFormService);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructurePlaintiffsCausesTitle);
  Icons = ConstPath;
  SearchByTextEnum = SearchByTextEnum;
  
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  searchText = signal<string>('');
  list = signal<PlaintiffsCausesTypes[]>([]);
  isImportDisabled = signal<boolean>(true);

  infrastructureForm: FormGroup;
  searchData = signal<InfrastructureFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  filter = signal<InfrastructureFilterOptions>({ currentPage: 1 });
  currentAuthority = signal<string | null>(null);
  includeInactive = signal<boolean>(false);

  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  loader = signal<boolean>(false);
  
  authorityID = toSignal(this.authorityService.authorityId$);

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const authorityID = this.authorityID();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
  }

  ngOnInit(): void {
    this.initializeTableAndForm();
    this.authorityService.setMunicipalsToNationalRegional();
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  back() {
    this.routerService.back();
  }

  private initializeTableAndForm(): void {
    const tableColumns = new InfrastructureTable();
    const form = new InfrastructureForms();

    this.currentAuthority.set(this.authorityService.getAuthorityID());
    this.columns.set(tableColumns.PlaintiffsCausesTable);
    this.dialogData.set(form.InfrastructurePlaintiffsCausesForm);

    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    
    this.searchData.set(searchData);
    this.filter.set(filter);
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
            'קוד,תיאור העילה,שיוך לקבוצה,סטטוס,קוד מכתב חניה,קוד מכתב כללי,קוד מכתב מנהלי,הדפסת ספח שובר,סוג דוח,שיוך להחלטה',
        },
      });

      runInInjectionContext(this.injector, () => {
        const dialogResult = toSignal(dialogRef.afterClosed());
        effect(() => {
          const result = dialogResult();
          if (result && result.uploadedFiles) {
            // Process the returned files (e.g., save them, pass them to a service, etc.)
            this.filesToUpload.set(result.uploadedFiles);

            // Call the importData function to process the uploaded files
            this.importData();
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
        const form = new InfrastructureForms();
        dialogData = form.InfrastructurePlaintiffsCausesForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          form: dialogData,
          isEdit: isEdit,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
        },
      });
      
      // Handle dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogResult = toSignal(dialogRef.afterClosed());
        effect(() => {
          const result = dialogResult();
          if (result) {
            const action = result.isEdit
              ? InfrastructureTableAction.Update
              : InfrastructureTableAction.Add;
            this.handleInsertOrUpdate(result.form, action);
          }
        });
      });
    }
  }

  async openDialogExport(): Promise<void> {
    const dialogRef = this.dialog.open(InfrastructureExportComponent, {
      // width: '835px',
      // height: '300px',
      autoFocus: false,
      data: {
        description:
          InfrastructureEnumDialogs.PlaintiffsCausesDialogExportDiscription,
      },
    });

    
    dialogRef
    .afterClosed()
    .pipe(take(1))
    .subscribe((res) => {
      if (res?.confirmed) this.exportData();
    });

  }

  async loadData(filter: any): Promise<void> {
    this.loader.set(true);
    
    filter = InfrastructuresUtils.normalizeFilter(filter);
    
    const startTime = Date.now();
    try {
      const currentFilter = { ...filter };
      currentFilter.currentPage = this.searchFormService.form.value.currentPage;
      currentFilter.searchText =
        this.infrastructureSearchFormService.form.value.searchText;
      
      this.filter.set(currentFilter);

      const updatedFilter = {
        ...this.filter(),
        includeInactive: this.includeInactive(),
      };
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.InspectorReservedRemark,
        this.currentAuthority()
      );

      if (result?.data) {
        const relatedGroupMapping = Utils.getRelatedGroupMapping();
        const processedData = result.data.map((item: any) => {
          return {
            ...item,
            relatedGroupName: relatedGroupMapping[item.relatedGroup],
            ticketTypeID:
              item.ticketTypeID !== 0
                ? Utils.getTicketTypeDisplayName(item.ticketType)
                : TicketTypeDisplayEnum[1],
            isPrintOnTicketHebrew: Utils.translateBoolean(item.isPrintOnTicket),
            isPrintOnTicket: item.isPrintOnTicket,
          };
        });

        this.data.set(processedData);
        this.total.set(result.totalRecords);
        this.count.set(result.data.length);
      }

      const searchText =
        this.infrastructureSearchFormService.form.value.searchText?.trim() ||
        '';

      this.isImportDisabled.set(
        InfrastructuresUtils.shouldDisableImport(this.data().length, searchText)
      );
    } catch (error) {
      InfrastructuresUtils.handleError(error, 'loadData');
    }

    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }


  async handleInsertOrUpdate(
    record: PlaintiffsCausesTypes,
    action: InfrastructureTableAction
  ): Promise<void> {
    try {
      const updatedObject = { ...record, authorityID: this.currentAuthority() };
      if (action === InfrastructureTableAction.Add) {
        updatedObject.isActive = true;
        delete updatedObject.reservedRemarkID;
      }

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        new PlaintiffsCausesTypes(updatedObject),
        InfrastructureTablesTypes.InspectorReservedRemark,
        action
      );

      if (result?.success) {
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (error) {
      InfrastructuresUtils.handleInsertUpdateError(error, this.toaster);
    }
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { 
        authorityID: this.currentAuthority(),
        includeInactive: this.includeInactive()
      }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.InspectorReservedRemark,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }

  async importData() {
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.InspectorReservedRemark,
        this.filesToUpload(),
        this.currentAuthority()!
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  openEdit(rowData: PlaintiffsCausesTypes): void {
    rowData.ticketType = Utils.getTicketTypeId(rowData.ticketTypeID!);

    const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      rowData
    );
    
    this.dialogData.set(updatedDialogData);
    this.openDialogForm(true);
  }

  async onCheckboxChange(includeInactive: boolean) {
    this.includeInactive.set(includeInactive);
    
    await InfrastructuresUtils.handleIncludeInactiveChange(
      includeInactive,
      this.filter,
      (filter) => this.loadData(filter)
    );
  }
}
