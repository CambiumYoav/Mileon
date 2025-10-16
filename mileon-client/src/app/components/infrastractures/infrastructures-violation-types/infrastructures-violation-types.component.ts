import { Component, Input, OnInit, OnDestroy, inject, signal, computed, effect, ChangeDetectionStrategy, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureForms,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  ViloationTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { Utils } from '../../../utils/utils';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-violation-types',
  templateUrl: './infrastructures-violation-types.component.html',
  styleUrls: ['./infrastructures-violation-types.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    InfrastructuresSearchComponent,
    ButtonComponent,
    InfrastructuresTableComponent,
  ],
})
export class InfrastructuresViolationTypesComponent implements OnInit, OnDestroy {
  private readonly infrastructureServer = inject(InfrastructureService);
  private readonly infrastructureSearchFormService = inject(SearchFormService);
  private readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly routerService = inject(RouterService);
  private readonly injector = inject(Injector);

  readonly title = signal<string>(TitlesEnum.InfrastructureViolationTitle);
  readonly columns = signal<Column[]>([]);
  readonly data = signal<ViloationTypes[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly searchText = signal<string>('');
  readonly searchData = signal<InfrastructureFilterOptions | undefined>(undefined);
  readonly filter = signal<FilterOptions>({ currentPage: 1 });
  readonly currentAuthority = signal<string | null>(null);
  readonly list = signal<ViloationTypes[]>([]);
  readonly dialogData = signal<DynamicRow[]>([]);
  readonly infrastructureForm = signal<FormGroup>(this.infrastructureSearchFormService.form);
  readonly loader = signal<boolean>(false);

  readonly Icons = ConstPath;
  readonly SearchByTextEnum = SearchByTextEnum;

  constructor() {
    // Convert authority subscription to signal
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
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  back(): void {
    this.routerService.back();
  }

  private initializeComponent(): void {
    const tableColumns = new InfrastructureTable();
    const form = new InfrastructureForms();

    this.columns.set(tableColumns.ViloationTypesTable);
    this.dialogData.set(form.InfrastructureViolationTypeForm);

    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    
    // this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();
  }

  async openDialogForm(isEdit: boolean = false): Promise<void> {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      let dialogData = this.dialogData();
      if (!isEdit) {
        const form = new InfrastructureForms();
        dialogData = form.InfrastructureViolationTypeForm;
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
            const action = result.isEdit
              ? InfrastructureTableAction.Update
              : InfrastructureTableAction.Add;
            this.handleInsertOrUpdate(result.form, action);
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }

  async handleInsertOrUpdate(
    newType: ViloationTypes,
    action: InfrastructureTableAction
  ): Promise<void> {
    try {
      const transformedType = {
        ...newType,
        authorityID: this.currentAuthority(),
      };
      if (action === InfrastructureTableAction.Add) {
        delete transformedType.violationTypeID;
      }

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        transformedType,
        InfrastructureTablesTypes.ViolationType,
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
      console.error('Error during insert or update:', error);
    }
  }

  async openDialogExport(): Promise<void> {
    const dialogRef = this.dialog.open(InfrastructureExportComponent, {
      autoFocus: false,
      data: {
        description:
          InfrastructureEnumDialogs.ViolationsTypesDialogExportDiscription,
      },
    });

    effect(() => {
      const result = dialogRef.componentInstance.dataSubject();
      if (result) {
        this.exportData();
        this.dialog.closeAll();
      }
    });
  }

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
    };

    const tableName = InfrastructureTablesTypes.ViolationType;
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
  openEdit(rowData: ViloationTypes): void {
    rowData.ticketTypeID = Utils.getTicketTypeId(
      rowData.ticketTypeID!.toString()
    );
    
    const updatedDialogData = this.dialogData().map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => ({
        ...field,
        value: rowData[field.name as keyof ViloationTypes] ?? field.value,
      })),
    }));
    
    this.dialogData.set(updatedDialogData);
    this.openDialogForm(true);
  }

  // Load data from server
  async loadData(filter: any): Promise<void> {
    this.loader.set(true);
    if (filter.value) filter = filter.value;

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const currentFilter = { ...filter };
      currentFilter.searchText = this.infrastructureSearchFormService.form.value.searchText;

      const updatedFilter = {
        ...currentFilter,
        ...filter.value,
      };
      
      this.filter.set(updatedFilter);
      
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.ViolationType,
        this.currentAuthority()
      );
      
      if (response?.data) {
        const transformedData = response.data.map((item: any) => ({
          ...item,
          ticketTypeID: Utils.getTicketTypeDisplayName(item.ticketTypeID),
        }));
        
        this.data.set(transformedData);
        this.total.set(response.totalRecords);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      //  Ensure the loader stays visible for at least `MIN_LOADER_TIME`
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }

  async fetchTicketsTypeOptions(): Promise<void> {
    try {
      const updatedDialogData = await Utils.fetchOptionsAndUpdateDialogData(
        this.infrastructureServer,
        InfrastructureTablesTypes.TicketsType,
        this.dialogData(),
        'ticketType',
        'ticketTypeID',
        'ticketTypeName'
      );
      this.dialogData.set(updatedDialogData);
    } catch (error) {
      console.error('Error fetching ticket type options:', error);
    }
  }
}
