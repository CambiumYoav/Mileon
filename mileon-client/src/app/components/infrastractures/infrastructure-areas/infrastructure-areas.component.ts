import { Component, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
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
  AreaTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';

import { Column } from '../../../types/table';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
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
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresTableComponent } from "../infrastructures-table/infrastructures-table.component";
import { InfrastructuresSearchComponent } from "../infrastructures-search/infrastructures-search.component";
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructure-areas',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresTableComponent,
    InfrastructuresSearchComponent
],
  templateUrl: './infrastructure-areas.component.html',
  styleUrls: ['./infrastructure-areas.component.scss'],
})
export class InfrastructureAreasComponent {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title: string = TitlesEnum.InfrastructureAreasTitle;
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
  infrastructureForm: FormGroup;
  filesToUpload = signal<UploadedFile[]>([]);
  isImportDisabled = signal<boolean>(true);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  dialogResult = signal<any>(null);
  importDialogResult = signal<any>(null);

  parkingTypes = {
    1: 'חניון',
    0: 'חניה ',
    2: 'עבודה ',
  };

  private dialogEffectRef: any;
  private importDialogEffectRef: any;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      this.currentAuthority.set(authorityID);
      if (authorityID) {
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
    this.columns.set(tableColumns.AreasTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureAreasForm);
    
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
            field.value = this.currentAuthority(); // ← your authority ID
            break;
          }
        }
        if (!isEdit) {
          const form = new InfrastructureForms();
          dialogData = form.InfrastructureAreasForm;
          for (const row of dialogData) {
            for (const field of row.row) {
              if (field.name === 'authorityID') {
                field.value = this.currentAuthority(); // ← your authority ID
                break;
              }
            }
          }
        }
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        hasBackdrop: true, 
        data: {
          form: dialogData,
          title: 'הוספה / עריכת רשומה',
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
  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          isSignsImport: false,
          description: InfrastructureEnumDialogs.AreasDialogImportDiscription,
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
  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          description: 'קוד,שם אזור,הגדרת אזור',
        },
      });

      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          effect(() => {
            const result = dialogResult();
            if (result !== null) {
              this.exportData();
              this.dialog.closeAll();
            }
          });
        }
      });
    }
  }

  async handleInsertOrUpdate(
    areaData: AreaTypes,
    action: InfrastructureTableAction
  ) {
    try {
      let newData: AreaTypes = new AreaTypes(areaData);
      if (newData && newData.streets) {
        const streetsIDS = newData.streets.map((street: any) => {
          // Extract ID whether it's an object or a primitive
          const streetID = typeof street === 'object' && street !== null ? (street.streetID || street.id) : street;
          return { streetID };
        });
        newData.streets = streetsIDS as any;
      }
      if (newData && newData.linkedInspectors) {
        const userIDS = newData.linkedInspectors.map((inspector: any) => {
          // Extract ID whether it's an object or a primitive
          const userID = typeof inspector === 'object' && inspector !== null ? (inspector.userID || inspector.id) : inspector;
          return { userID };
        });
        newData.linkedInspectors = userIDS as any;
      }
      newData = { ...newData, authorityID: this.currentAuthority() };

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newData,
        InfrastructureTablesTypes.Areas,
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

  openEdit(rowData: AreaTypes) {
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
      this.filter.set({ ...filter });
      const updatedFilter = {
        ...this.filter(),
        ...filter.value,
        searchText: this.infrastructureSearchFormService.form.value.searchText,
      };
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Areas,
        this.currentAuthority()
      );

      const formattedData = result.data.map((area: any) => {
        const formattedObj = {
          ...area,
          parkingTypeDisplay:
            area.parkingType !== null
              ? this.parkingTypes[area.parkingType as keyof typeof this.parkingTypes]
              : '',
          // streetsDisplay:
          //   area.streets.length > 0
          //     ? area.streets.map((street) => street.streetName).join(', ')
          //     : '',

          streetsDisplay: area.allStreets // If allStreets is true, show "כל הרחובות"
            ? 'כל הרחובות'
            : area.streets.map((street: any) => street.streetName).join(', '),

          streets: area.streets.map((street: any) => ({ 
            id: street.streetID, 
            value: street.streetName 
          })),
          linkedInspectors: area.linkedInspectors.map((user: any) => ({ 
            id: user.userID, 
            value: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.userName || 'Unknown'
          })),
        };
        return formattedObj;
      });
      
      this.data.set(formattedData);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);

      const searchText =
        this.infrastructureSearchFormService.form.value.searchText?.trim() ||
        '';

      // Set `isImportDisabled` based on the conditions
      this.isImportDisabled.set(
        formattedData.length === 0
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

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Areas,
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

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      authorityID: this.currentAuthority(),
    };
    const tableName = InfrastructureTablesTypes.Areas;
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
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.error(e);
    }
  }
}
