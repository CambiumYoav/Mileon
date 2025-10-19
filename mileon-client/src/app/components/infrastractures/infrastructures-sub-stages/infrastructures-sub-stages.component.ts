import { Component, signal, computed, effect, inject, OnInit, OnDestroy, runInInjectionContext, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ConstPath } from '../../../constants/const_path'; 
import { TitlesEnum } from '../../../types/enum/titlesEnum'; 
import { Column } from '../../../types/table';
import {
  InfrastructureForms,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  TicketStatus,
  TicketSubStage,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { SubStagesTypesEnum } from '../../../types/enum/subStagesEnum';
import { Utils } from '../../../utils/utils';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { AuthorityService } from '../../../services/authority.service ';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructures-sub-stages',
  templateUrl: './infrastructures-sub-stages.component.html',
  styleUrls: ['./infrastructures-sub-stages.component.scss'],
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
export class InfrastructuresSubStagesComponent implements OnInit, OnDestroy {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private authorityService = inject(AuthorityService);
  private toaster = inject(ToastrService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructureSubStageTitle);
  Icons = ConstPath;
  SearchByTextEnum = SearchByTextEnum;
  
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  list = signal<TicketSubStage[]>([]);

  searchText = signal<string>('');
  searchData = signal<InfrastructureFilterOptions>({
    searchText: '',
    order: 1,
    currentPage: 1,
  });
  filter = signal<InfrastructureFilterOptions>({ currentPage: 1 });
  includeInactive = signal<boolean>(false);

  infrastructureForm: FormGroup;
  dialogData = signal<DynamicRow[]>([]);

  ticketStatusOptions = signal<any[]>([]);
  ticketStatusData = signal<any[]>([]);
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  
  authorityID = toSignal(this.authorityService.authorityId$);

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const authorityID = this.authorityID();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form.value);
      }
    });
  }

  ngOnInit(): void {
    this.initializeComponent();
    
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    
    this.searchData.set(searchData);
    this.filter.set(filter);
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  private initializeComponent(): void {
    const tableColumns = new InfrastructureTable();
    const form = new InfrastructureForms();

    this.columns.set(tableColumns.SubStagesTable);
    this.dialogData.set(form.InfrastructureSubStagesForm);
    // this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();
    // Authority subscription is now handled in constructor effect
  }

  async openDialogForm(isEdit: boolean = false): Promise<void> {
    // await this.fetchTicketStatusOptions();

    let dialogData = isEdit ? this.dialogData() : await this.resetDialogData();

    const dialogRef = this.dialog.open(InfrastructureFormComponent, {
      // width: '835px',
      autoFocus: false,
      data: {
        form: dialogData,
        title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
        isEdit,
      },
    });

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

  back() {
    this.routerService.back();
  }

  private async resetDialogData(): Promise<DynamicRow[]> {
    const form = new InfrastructureForms();
    return form.InfrastructureSubStagesForm;
  }

  getTypeMapping(): { [key: string]: number } {
    return Object.fromEntries(
      Object.keys(SubStagesTypesEnum)
        .filter((key) => isNaN(Number(key))) // Filter out numeric keys
        .map((key) => [
          key,
          SubStagesTypesEnum[key as keyof typeof SubStagesTypesEnum],
        ])
    );
  }

  openEdit(rowData: TicketSubStage): void {
    const typeMapping = this.getTypeMapping();
    if (!typeMapping[rowData.type!]) {
      return;
    }
    const transformedData = {
      ...rowData,
      ticketStatusName: rowData.ticketStatus?.ticketStatusName || '',
      type:
        typeMapping[rowData.type!] !== undefined
          ? typeMapping[rowData.type!]
          : rowData.type, // Use the name for dropdown display
    };
    
    const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      transformedData
    );
    this.dialogData.set(updatedDialogData);

    this.openDialogForm(true);
  }

  /** Export Operations */
  async openDialogExport(): Promise<void> {
    const dialogRef = this.dialog.open(InfrastructureExportComponent, {
      // width: '835px',
      // height: '300px',
      autoFocus: false,
      data: {
        description: InfrastructureEnumDialogs.SubStagesDialogDiscription,
      },
    });

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

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { includeInactive: this.includeInactive() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.TicketSubStage,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }
  async handleInsertOrUpdate(
    newType: TicketSubStage,
    action: InfrastructureTableAction
  ): Promise<void> {
    try {
      const typeMapping = this.getTypeMapping();

      // Determine ticketStatusID
      let ticketStatusID: number | undefined;

      if (
        typeof newType.ticketStatus === 'object' &&
        newType.ticketStatus !== null
      ) {
        // Extract ticketStatusID if ticketStatus is an object
        ticketStatusID = (newType.ticketStatus as TicketStatus).ticketStatusID;
      } else if (typeof newType.ticketStatus === 'number') {
        // Use the numeric value directly
        ticketStatusID = newType.ticketStatus;
      }

      // Transform the data for the server
      const transformedType = {
        ...newType,
        ticketStatusID, // Send ticketStatusID to the server
        type: typeMapping[newType.type!] ?? newType.type, // Map type if necessary
      };

      // Remove the original ticketStatus to avoid conflicts
      delete transformedType.ticketStatus;
      if (action === InfrastructureTableAction.Add)
        delete transformedType.subStageID;

      // Send the transformed data to the server
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        transformedType,
        InfrastructureTablesTypes.TicketSubStage,
        action
      );

      if (result && result?.success) {
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (error) {
      InfrastructuresUtils.handleInsertUpdateError(error, this.toaster);
    }
  }

  async fetchTicketStatusOptions(): Promise<void> {
    try {
      const response = await this.infrastructureServer.getInfrastructureTable(
        { currentPage: 1 },
        InfrastructureTablesTypes.TicketStatus
      );
      
      if (response && Array.isArray(response.data)) {
        const options = response.data.map((item: any) => ({
          value: item.ticketStatusID,
          display: item.ticketStatusName,
        }));
        
        this.ticketStatusOptions.set(options);
        this.ticketStatusData.set(response.data);
      }
    } catch (error) {
      console.error('Error fetching ticket status options:', error);
    }
  }

  async loadData(filter: any): Promise<void> {
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
        includeInactive: this.includeInactive(),
      };
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.TicketSubStage
      );

      if (response?.data) {
        const processedData = response.data.map((item: any) => ({
          ...item,
          ticketStatusName: item.ticketStatus?.ticketStatusName || '',
          type:
            Object.keys(SubStagesTypesEnum).find(
              (key) =>
                SubStagesTypesEnum[key as keyof typeof SubStagesTypesEnum] ===
                item.type
            ) || item.type,
        }));
        
        this.data.set(processedData);
        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
    } catch (error) {
      InfrastructuresUtils.handleError(error, 'loadData');
    }
    
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
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
