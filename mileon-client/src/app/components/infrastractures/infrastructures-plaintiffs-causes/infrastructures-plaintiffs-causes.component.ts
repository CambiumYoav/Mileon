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
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

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

    this.currentAuthority.set(this.authorityService.getAuthorityID());
    const form = new InfrastructureForms();

    this.columns.set(tableColumns.PlaintiffsCausesTable);
    this.dialogData.set(form.InfrastructurePlaintiffsCausesForm);

    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
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

      // Handle dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogResult = toSignal(dialogRef.afterClosed());
        effect(() => {
          const result = dialogResult();
          if (result && result.uploadedFiles) {
            // Process the returned files (e.g., save them, pass them to a service, etc.)
            this.filesToUpload.set(result.uploadedFiles);

            // Call the importData function to process the uploaded files
            this.importData();
          } else if (result !== undefined) {
            console.log('Dialog was closed without uploading files.');
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

    // Handle export dialog result using runInInjectionContext for proper effect usage
    runInInjectionContext(this.injector, () => {
      const dialogResult = toSignal(dialogRef.afterClosed());
      effect(() => {
        const result = dialogResult();
        if (result) {
          this.exportData();
          this.dialog.closeAll();
        }
      });
    });
  }

  // Data Fetch and Update Functions
  async loadData(filter: any): Promise<void> {
    this.loader.set(true);
    if (filter.value) filter = filter.value;
    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const currentFilter = { ...filter };
      currentFilter.currentPage = this.searchFormService.form.value.currentPage;
      currentFilter.searchText =
        this.infrastructureSearchFormService.form.value.searchText;
      
      this.filter.set(currentFilter);

      const updatedFilter = {
        ...this.filter(),
        ...filter.value,
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

      // Set `isImportDisabled` based on the conditions
      this.isImportDisabled.set(
        this.data().length === 0
          ? searchText !== '' // Disable if no data and there is search text
          : true // Enable if there is data
      );
    } catch (error) {
      console.error('Error loading data:', error);
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

  // Insert or Update Records
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
        this.loadData(this.infrastructureSearchFormService.form);
        this.dialog.closeAll();
        if (action == InfrastructureTableAction.Add) {
          this.toaster.success(ErrorSuccessMessages.ADDED_SUCCESUFULY);
        }
        if (action == InfrastructureTableAction.Update) {
          this.toaster.success(ErrorSuccessMessages.UPDATED_SUCCESUFULY);
        }
      }
    } catch (error) {
      this.toaster.error(ErrorSuccessMessages.DEFAULT);
      console.error('Error inserting or updating record:', error);
    }
  }

  // Export Data
  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      authorityID: this.currentAuthority(),
      includeInactive: this.includeInactive(),
    };
    const tableName = InfrastructureTablesTypes.InspectorReservedRemark;
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

  // Import Data
  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.InspectorReservedRemark,
          this.filesToUpload(),
          this.currentAuthority()!
        )
        .then((res) => {
          if (res.errors) {
            this.toaster.error(
              ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
            );
          } else {
            this.loadData(this.infrastructureSearchFormService.form);
            this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
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

  // Edit Row Data
  openEdit(rowData: PlaintiffsCausesTypes): void {
    rowData.ticketType = Utils.getTicketTypeId(rowData.ticketTypeID!);

    const updatedDialogData = this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => ({
        ...field,
        value: (rowData as any)[field.name] ?? field.value,
      }));
      return dynamicRow;
    });
    this.dialogData.set(updatedDialogData);
    this.openDialogForm(true);
  }

  async onCheckboxChange(includeInactive: boolean) {
    this.includeInactive.set(includeInactive);

    // Reset filter and update currentPage  value
    this.filter.set({ currentPage: 1, includeInactive });

    await this.loadData(this.filter());
  }
}
