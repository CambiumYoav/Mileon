import { Component, OnInit, OnDestroy, inject, signal, computed, effect, ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { FormGroup, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ConstPath } from '../../../constants/const_path';
import { TitlesEnum } from '../../../types/enum/titlesEnum'; 
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureTable,
  InfrastructureForms,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  DeliveryMethodType,
  InfrastructureFilterOptions,
} from '../../../types/infrastructure/infrastructureFilterOptions';

import { Column } from '../../../types/table';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureSearchFormService } from '../infrastructures-search/infrastructure-search-form.service';
import {
  InfrastructureTableAction,
  InfrastructureTablesTypes,
} from '../../../types/enum/infrastructureTablesEnum';
import { Utils } from '../../../utils/utils';
import { LookupNewService } from '../../../services/lookup-new.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { UploadedFile } from '../../../types/uploadedFile';
  import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { DeliveryMethodTypeEnum } from '../../../types/enum/deliveryMethodType';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { AuthorityService } from '../../../services/authority.service ';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresTicketsSourceTableComponent } from '../infrastructures-tickets-source-table/infrastructures-tickets-source-table.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';

@Component({
  selector: 'app-infrastructures-tickets-source',
  templateUrl: './infrastructures-tickets-source.component.html',
  styleUrls: ['./infrastructures-tickets-source.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    InfrastructuresSearchComponent,
    ButtonComponent,
    InfrastructuresTicketsSourceTableComponent,
    SelectComponent,
  ],
})
export class InfrastructuresTicketsSourceComponent implements OnInit, OnDestroy {
  private readonly infrastructureServer = inject(InfrastructureService);
  private readonly infrastructureSearchFormService = inject(SearchFormService);
  private readonly dialog = inject(MatDialog);
  private readonly lookupService = inject(LookupNewService);
  private readonly toaster = inject(ToastrService);
  private readonly routerService = inject(RouterService);
  private readonly authorityService = inject(AuthorityService);

  readonly title = signal<string>(TitlesEnum.InfrastructureTicketsSourceTitle);
  readonly columns = signal<Column[]>([]);
  readonly data = signal<any[]>([]);
  readonly total = signal<number>(0);
  readonly count = signal<number>(0);
  readonly searchText = signal<string>('');
  readonly searchData = signal<InfrastructureFilterOptions | undefined>(undefined);
  readonly filter = signal<FilterOptions | undefined>(undefined);
  readonly list = signal<DeliveryMethodType[]>([]);
  readonly dialogData = signal<DynamicRow[]>([]);
  readonly filesToUpload = signal<UploadedFile[]>([]);
  readonly infrastructureForm = signal<FormGroup>(this.infrastructureSearchFormService.form);
  readonly authorities = signal<any[]>([]);
  readonly selectedAuthority = signal<any>(null);
  readonly currentAuthority = signal<{ id: string; value: string } | null>(null);
  readonly loader = signal<boolean>(false);

  readonly Icons = ConstPath;
  readonly SearchByTextEnum = SearchByTextEnum;
  readonly mviewAuthority = '11111111-1111-1111-1111-111111111111';
  constructor() {
    effect(() => {
      const authority = this.currentAuthority();
      if (authority) {
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.TicketsSourceAndMethodTable);
    
    this.authorityService.setMunicipalsToNationalAdmin();

    // Add authority form control
    this.infrastructureSearchFormService.form.addControl('authority', new FormControl(null));
    
    // Subscribe to authority control value changes
    this.infrastructureSearchFormService.form.get('authority')?.valueChanges.subscribe((authorityId) => {
      // Find the full authority object from the ID
      const authoritiesList = this.authorities();
      const selectedAuthority = authoritiesList.find(auth => auth.id === authorityId);
      
      if (selectedAuthority && selectedAuthority.id !== this.currentAuthority()?.id) {
        this.onAuthorityChange(selectedAuthority);
      }
    });
    
    if (!this.infrastructureSearchFormService.form.get('currentPage')?.value) {
      this.infrastructureSearchFormService.form.patchValue({
        currentPage: 1,
        searchText: '',
        order: 1,
      });
    }

    this.fetchAuthorities();
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureTicketsSourceForm);
    
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    
    this.searchData.set(searchData);
    this.filter.set(filter);
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  back() {
    this.routerService.back();
  }

  async fetchAuthorities(): Promise<void> {
    try {
      const response = await this.lookupService.getAuthorities();

      const castedResponse = response as any as {
        list: { id: string; value: string }[];
      };

      if (castedResponse.list) {
        this.authorities.set(castedResponse.list);
      }
      const authoritiesList = this.authorities();
      if (authoritiesList && authoritiesList.length > 0) {
        // Set the form control value to just the ID
        this.infrastructureSearchFormService.form.get('authority')?.setValue(authoritiesList[0].id);
        // The valueChanges subscription will handle calling onAuthorityChange and setting currentAuthority
      }
    } catch (error) {
      console.error('Error fetching authorities:', error);
    }
  }

  onAuthorityChange(selected: any): void {
    this.currentAuthority.set(selected);
    
    // Reset all relevant data
    this.data.set([]);
    this.total.set(0);
    this.count.set(0);

    // loadData will be called automatically by the effect when currentAuthority changes
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: {
          isSignsImport: true,
        },
      });

      // Convert subscription to async/await pattern
      const result = await firstValueFrom(dialogRef.afterClosed());
      if (result && result.uploadedFiles) {
        // Process the returned files (e.g., save them, pass them to a service, etc.)
        this.filesToUpload.set(result.uploadedFiles);

        // Call the importData function to process the uploaded files
        this.importData();
      }
    }
  }
  async openDialogForm(isEdit: boolean = false) {
    let dialogComponent = InfrastructureFormComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        autoFocus: false,
        data: { form: this.dialogData(), title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle, isEdit },
      });
      
      const result = await firstValueFrom(dialogRef.afterClosed());
      
      if (result) {
        const action = result.isEdit
          ? InfrastructureTableAction.Update
          : InfrastructureTableAction.Add;
        await this.handleInsertOrUpdate(result.form, action);
      }
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
          description: InfrastructureEnumDialogs.TicketsSourceDialogExportDiscription,
        },
      });
      
      const result = await firstValueFrom(dialogRef.afterClosed());
      
      if (result) {
        await this.exportData();
      }
    }
  }

  async handleInsertOrUpdate(
    newType: DeliveryMethodType,
    action: InfrastructureTableAction
  ) {
    try {
      const deliveryMethodMap: { [key: number]: string } = {
        1: DeliveryMethodTypeEnum.Pickup,
        2: DeliveryMethodTypeEnum.HandDelivered,
        3: DeliveryMethodTypeEnum.RegisteredMail,
      };
      const deliveryMethodName =
        deliveryMethodMap[Number(newType.deliveryMethodTypeID)];
      const newObject = {
        ...newType,
        name: deliveryMethodName,
        authorityID: this.currentAuthority()?.id,
      };
      delete newObject.ticketTypeName;
      // delete newObject.deliveryMethodName;

      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newObject,
        InfrastructureTablesTypes.DeliveryMethod,
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
    if (!rowData.methods || !Array.isArray(rowData.methods)) {
      console.error('No methods array found in the selected row');
      return;
    }

    const ticketSourceID = rowData.ticketSourceID;
    const selectedAuthorityID = this.currentAuthority()?.id;

    const extractedData = rowData.methods.map((method: any) => ({
      deliveryMethodID: method.deliveryMethodID,
      deliveryMethodName: method.deliveryMethodName || 'N/A',
      ticketTypeName: method.ticketTypeName || 'N/A',
      ticketTypeID: method.ticketTypeID || 'N/A',
      ticketStageName: method.ticketStageName || 'N/A',
      ticketSourceID: ticketSourceID,
      authorityID: selectedAuthorityID,
      deliveryMethodTypeID: Utils.getDeliveryMethodId(
        method.deliveryMethodName
      ),
      ticketStageID: Utils.getTicketStageId(method.ticketStageName),
    }));

    // Populate dialogData with the first method (or handle multiple if needed)
    if (extractedData.length > 0) {
      const firstMethod = extractedData[0]; // You can loop through all methods if required

      const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
        this.dialogData(),
        firstMethod
      );
      this.dialogData.set(updatedDialogData);
    }

    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    this.loader.set(true);
    try {
      filter = InfrastructuresUtils.normalizeFilter(filter);
      
      const updatedFilter = {
        ...filter,
        searchText: filter.searchText || '',
        currentPage: filter.currentPage || 1,
      };
      
      const result = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.DeliveryMethod,
        this.currentAuthority()?.id
      );
      
      this.total.set(result.totalRecords || 0);
      this.count.set(result.data?.length || 0);

      if (result.data && result.data.length > 0) {
        const transformed = this.transformServerResponse(result.data);
        this.data.set([...transformed.data]);
      } else {
        this.data.set([]);
      }
    } catch (e) {
      InfrastructuresUtils.handleError(e, 'loadData');
      this.data.set([]);
      this.total.set(0);
      this.count.set(0);
    }
    this.loader.set(false);
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { authorityID: this.currentAuthority()?.id }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.DeliveryMethod,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }

  async importData() {
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.DeliveryMethod,
        this.filesToUpload(),
        this.mviewAuthority
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  transformServerResponse = (serverResponse: any) => {
    if (!serverResponse || serverResponse.length === 0) {
      return { data: [] };
    }
    
    try {
      const transformedData = serverResponse.reduce(
        (acc: any[], current: any) => {
          const ticketSourceID = current.ticketSourceID;
          const ticketSourceName = current.ticketSource?.ticketSourceName || current.ticketSourceName || 'N/A';
          const deliveryMethodID = current.deliveryMethodID || current.id;
          const deliveryMethodName = current.name || current.deliveryMethodName || 'N/A';
          const ticketType = current.ticketType || {};
          const ticketTypeID = current.ticketTypeID || ticketType.ticketTypeID;
          const ticketStage = current.ticketStage || {};

          let existingSource = acc.find(
            (source) => source.ticketSourceID === ticketSourceID
          );

          if (!existingSource) {
            existingSource = {
              ticketSourceID,
              ticketSourceName,
              ticketTypeID,
              ticketDeliveryMethods: [],
            };
            acc.push(existingSource);
          }

          existingSource.ticketDeliveryMethods.push({
            deliveryMethodID,
            deliveryMethodName,
            ticketTypeID: ticketType.ticketTypeID || ticketTypeID,
            ticketType: {
              ticketTypeID: ticketType.ticketTypeID || ticketTypeID,
              ticketTypeName: ticketType.ticketTypeName || 'N/A',
            },
            ticketStage: {
              stageID: ticketStage?.stageID || null,
              name: ticketStage?.name || 'NA',
            },
          });

          return acc;
        },
        []
      );
      
      return { data: transformedData };
    } catch (error) {
      console.error('Error transforming server response:', error);
      return { data: [] };
    }
  };
}
