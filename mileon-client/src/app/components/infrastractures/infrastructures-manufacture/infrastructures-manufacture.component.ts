import { Component, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConstPath } from '../../../constants/const_path';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureForms,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  VehicleManufacturer,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { Utils } from '../../../utils/utils';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-manufacture',
  templateUrl: './infrastructures-manufacture.component.html',
  styleUrls: ['./infrastructures-manufacture.component.scss'],
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
export class InfrastructuresManufactureComponent {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructureVehicleTitle);
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
  filter = signal<InfrastructureFilterOptions>({
    searchText: '',
    currentPage: 1,
  });
  list = signal<VehicleManufacturer[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  loader = signal<boolean>(false);
  includeInactive = signal<boolean>(false);
  currentAuthority = signal<string | null>(null);

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

  back() {
    this.routerService.back();
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.ManufactureTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureManufacturerForm);
    
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });
    
    // this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureManufacturerForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
          isEdit: isEdit,
        },
      });
      // Handle dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          effect(() => {
            const result = dialogResult();
            if (result && typeof result === 'object' && result !== null && 
                'form' in result && 'isEdit' in result) {
              const action = (result as any).isEdit
                ? InfrastructureTableAction.Update
                : InfrastructureTableAction.Add;
              this.handleInsertOrUpdate((result as any).form, action);
            }
          });
        }
      });
    }
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          description: InfrastructureEnumDialogs.ManufactureDialogExportDiscription,
        },
      });
      // Handle export dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
        const dialogInstance = dialogRef.componentInstance;
        const dataSubject = dialogInstance.dataSubject();
        if (dataSubject) {
          const dialogResult = toSignal(dataSubject);
          effect(() => {
            const result = dialogResult();
            if (result) {
              this.exportData();
              this.dialog.closeAll();
            }
          });
        }
      });
    }
  }

  async handleInsertOrUpdate(
    newType: VehicleManufacturer,
    action: InfrastructureTableAction
  ) {
    try {
      if (action === InfrastructureTableAction.Add) newType.manufacturerID = 0;
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newType,
        InfrastructureTablesTypes.VehicleManufacturer,
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

  openEdit(rowData: VehicleManufacturer) {
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

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      includeInactive: this.includeInactive(),
    };
    const tableName = InfrastructureTablesTypes.VehicleManufacturer;

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

  async loadData(filter: any) {
    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      this.loader.set(true);

      if (filter.value) filter = filter.value;

      const currentFilter = { ...filter };
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
        InfrastructureTablesTypes.VehicleManufacturer
      );
      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);
    } catch (e) {
      console.error(e);
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

  async onCheckboxChange(includeInactive: boolean) {
    this.includeInactive.set(includeInactive);

    // Reset filter and update currentPage  value
    this.filter.set({ currentPage: 1, includeInactive });

    await this.loadData(this.filter());
  }
}
