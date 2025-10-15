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
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

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

    this.fetchAuthorities();
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureTicketsSourceForm);
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    this.filter.set({
      searchText: '', // this value does not get updated in the input
      currentPage: 1,
    });
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

      // Cast the response to the expected structure
      const castedResponse = response as any as {
        list: { id: string; value: string }[];
      };

      if (castedResponse.list) {
        this.authorities.set(castedResponse.list);
      }
      const authoritiesList = this.authorities();
      if (authoritiesList && authoritiesList.length > 0) {
        // Set the form control value
        this.infrastructureSearchFormService.form.get('authority')?.setValue(authoritiesList[0]);
        // Set the current authority and load data without triggering onAuthorityChange
        this.currentAuthority.set(authoritiesList[0]);
        this.loadData(this.infrastructureSearchFormService.form);
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

    // Load new data
    this.loadData(this.infrastructureSearchFormService.form);
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
      } else {
        console.log('Dialog was closed without uploading files.');
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
      const dialogInstance = dialogRef.componentInstance;
      // Use effect to watch for signal changes
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
          description: InfrastructureEnumDialogs.TicketsSourceDialogExportDiscription,
        },
      });
      const dialogInstance = dialogRef.componentInstance;
      // Use effect to watch for signal changes
      effect(() => {
        const result = dialogInstance.dataSubject();
        if (result) {
          this.exportData();
          this.dialog.closeAll();
        }
      });
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
      console.error(e);
    }
  }

  openEdit(rowData: any) {
    // Validate and extract methods data
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

      this.dialogData.set(this.dialogData().map((dynamicRow) => {
        dynamicRow.row = dynamicRow.row.map((field) => {
          if (firstMethod[field.name] !== undefined) {
            // Update field value if it exists in extracted data
            return { ...field, value: firstMethod[field.name] };
          }
          return field;
        });
        return dynamicRow;
      }));
    }

    // Open the dialog form with the populated data
    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    this.loader.set(true);
    try {
      const result = await this.infrastructureServer.getInfrastructureTable(
        filter.value,
        InfrastructureTablesTypes.DeliveryMethod,
        this.currentAuthority()?.id
      );
      this.total.set(result.totalRecords);
      this.count.set(result.data.length);

      const transformed = this.transformServerResponse(result.data);

      this.data.set([...transformed.data]);
    } catch (e) {
      console.error('Error loading data:', e);
    }
    this.loader.set(false);
  }

  async exportData(): Promise<void> {
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
      authorityID: this.currentAuthority()?.id,
    };
    const tableName = InfrastructureTablesTypes.DeliveryMethod;

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

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.DeliveryMethod,
          this.filesToUpload,
          this.mviewAuthority
        )
        .then((res) => {
          this.loadData(this.infrastructureSearchFormService.form);
          this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
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

  transformServerResponse = (serverResponse: any) => {
    const transformedData = serverResponse.reduce(
      (acc: any[], current: any) => {
        const {
          ticketSourceID,
          ticketSource: { ticketSourceName },
          deliveryMethodID,
          name: deliveryMethodName,
          ticketType,
          ticketTypeID,
          ticketStage,
        } = current;

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
          ticketTypeID: ticketType.ticketTypeID,
          ticketType: {
            ticketTypeID: ticketType.ticketTypeID,
            ticketTypeName: ticketType.ticketTypeName,
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
  };
}
