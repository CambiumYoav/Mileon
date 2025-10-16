import { Component, OnInit, OnDestroy, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureForms,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  VehicleColor,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructures-colors',
  templateUrl: './infrastructures-colors.component.html',
  styleUrls: ['./infrastructures-colors.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
    ButtonComponent,
    CheckboxComponent
  ]
})
export class InfrastructuresColorsComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title: string = TitlesEnum.InfrastructureVehicleTitle;
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
  list = signal<VehicleColor[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  infrastructureForm: FormGroup;
  includeInactive = signal<boolean>(false);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    const authorityIDSignal = toSignal(this.authorityService.authorityId$, { initialValue: null });
    
    effect(() => {
      const authorityID = authorityIDSignal();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form.value);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.ColorTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureColorForm);
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

  back() {
    this.routerService.back();
  }

  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureColorForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
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
          description: InfrastructureEnumDialogs.ColorsDialogDiscription,
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
    newType: VehicleColor,
    action: InfrastructureTableAction
  ) {
    try {
      if (action === InfrastructureTableAction.Add) newType.vehicleColorID = 0;
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newType,
        InfrastructureTablesTypes.VehicleColor,
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

  openEdit(rowData: VehicleColor) {
    this.dialogData.set(this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if ((rowData as any)[field.name] !== undefined) {
          return { ...field, value: (rowData as any)[field.name] };
        }
        return field;
      });
      return dynamicRow;
    }));
    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    this.loader.set(true);
    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      this.filter.set({ ...filter });
      const currentFilter = this.filter();
      currentFilter.searchText =
        this.infrastructureSearchFormService.form.value.searchText;

      const updatedFilter = {
        ...currentFilter,
        ...filter.value,
        includeInactive: this.includeInactive(),
      };

      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.VehicleColor
      );
      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);
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
      includeInactive: this.includeInactive(),
    };

    const tableName = InfrastructureTablesTypes.VehicleColor;
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

  async onCheckboxChange(includeInactive: boolean) {
    this.includeInactive.set(includeInactive);

    // Reset filter and update currentPage  value
    this.filter.set({ currentPage: 1, includeInactive });

    await this.loadData(this.filter());
  }
}
