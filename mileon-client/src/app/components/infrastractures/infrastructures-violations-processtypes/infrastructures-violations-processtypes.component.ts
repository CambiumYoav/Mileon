import { Component, signal, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
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
  ViolationsProcessTypes,
  ViolationsTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';

import { Column } from '../../../types/table';
import { Utils } from '../../../utils/utils';
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
import { InfrastructureEnumDialogs } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-violations-processtypes',
  templateUrl: './infrastructures-violations-processtypes.component.html',
  styleUrls: ['./infrastructures-violations-processtypes.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent
  ]
})
export class InfrastructuresViolationsProcessTypesComponent implements OnInit, OnDestroy {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);

  title = signal<string>(TitlesEnum.InfrastructureViolationsProcessTypesTitle);
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
  list = signal<ViolationsProcessTypes[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isImportDisabled = signal<boolean>(true);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  violationID = signal<any>('');
  
  authorityID = toSignal(this.authorityService.authorityId$);
  
  infrastructureForm: FormGroup;

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
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.ViolationsProcessTypesTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureViolationProcessTypeForm);
    
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

  back() {
    this.routerService.back();
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  async openDialogForm(isEdit: boolean) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureViolationProcessTypeForm;
      }

      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: 'הוספה / עריכת רשומה',
          isEdit: isEdit,
        },
      });

      const dialogClosed = toSignal(dialogRef.afterClosed());
      effect(() => {
        const result = dialogClosed();
        if (result !== undefined) {
          // Restore ticketTypeID to its string representation
          const updatedData = this.data().map((v) => ({
            ...v,
            ticketTypeName: v.ticketType?.ticketTypeName,
          }));
          this.data.set(updatedData);
        }
      });
      
      const dialogInstance = dialogRef.componentInstance;
      effect(() => {
        const result = dialogInstance.dataSubject();
        if (result) {
          const action = result.isEdit
            ? InfrastructureTableAction.Update
            : InfrastructureTableAction.Add;
          this.handleInsertOrUpdate(result.form, action);
        }
      });
    }
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        // height: '300px',
        autoFocus: false,
        data: {
          description: InfrastructureEnumDialogs.ViolationsProcessTypesDialogExportDiscription,
        },
      });

      const dialogInstance = dialogRef.componentInstance;
      effect(() => {
        const result = dialogInstance.dataSubject();
        if (result) {
          this.exportData();
          this.dialog.closeAll();
        }
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
          description: InfrastructureEnumDialogs.ViolationsProcessTypesDialogImportDiscription,
        },
      });

      const dialogClosed = toSignal(dialogRef.afterClosed());
      effect(() => {
        const result = dialogClosed();
        if (result && result.uploadedFiles) {
          // Process the returned files (e.g., save them, pass them to a service, etc.)
          this.filesToUpload.set(result.uploadedFiles);

          // Call the importData function to process the uploaded files
          this.importData();
        } else if (result !== undefined) {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }

  async handleInsertOrUpdate(
    newViolation: ViolationsProcessTypes,
    action: InfrastructureTableAction
  ) {
    try {
      const newData = new ViolationsProcessTypes(newViolation);
      if (action === InfrastructureTableAction.Add) {
        delete newData.violationID;
      }
      if (action === InfrastructureTableAction.Update) {
        newData.violationID = this.violationID();
      }
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newData,
        InfrastructureTablesTypes.ViolationProcessType,
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

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Violation,
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

  openEdit(rowData: ViolationsTypes) {
    if (rowData.violationID) this.violationID.set(rowData.violationID);

    const updatedDialogData = this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if ((rowData as any)[field.name] !== undefined) {
          return { ...field, value: (rowData as any)[field.name] };
        }
        return field;
      });
      return dynamicRow;
    });
    this.dialogData.set(updatedDialogData);

    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    this.loader.set(true);
    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const currentFilter = { ...filter };
      currentFilter.searchText =
        this.infrastructureSearchFormService.form.value.searchText;
      
      this.filter.set(currentFilter);

      const updatedFilter = {
        ...this.filter(),
        ...filter.value,
      };
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.ViolationProcessType,
        this.currentAuthority()
      );
      
      const processedData = result.data.map((v: any) => ({
        ...v,
        photoRequiredDisplay: v.photoRequired ? 'כן' : 'לא',
        // ticketTypeID: Utils.getTicketTypeDisplayName(v.ticketTypeID),
        ticketTypeName: v.ticketType?.ticketTypeName,
      }));
      
      this.data.set(processedData);
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

    const tableName = InfrastructureTablesTypes.ViolationProcessType;
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
    }
  }
}
