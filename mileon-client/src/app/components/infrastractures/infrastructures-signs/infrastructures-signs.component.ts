import { Component, signal, computed, effect, inject, OnInit, OnDestroy, runInInjectionContext, Injector } from '@angular/core';
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
  SignsTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { InfrastructureService } from '../infrastructure.service';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructureEnumTitles } from '../../../types/enum/Infrastructure.enum';

@Component({
  selector: 'app-infrastructures-signs',
  templateUrl: './infrastructures-signs.component.html',
  styleUrls: ['./infrastructures-signs.component.scss'],
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
export class InfrastructuresSignsComponent implements OnInit, OnDestroy {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title = signal<string>(TitlesEnum.InfrastructureSignsTitle);
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
  list = signal<SignsTypes[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  fileData = signal<any>(null);
  loader = signal<boolean>(false);
  currentAuthority = signal<string | null>(null);
  includeInactive = signal<boolean>(false);
  
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
    this.columns.set(tableColumns.SignsTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureSignsForm);
    
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

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
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

      // Handle dialog result using runInInjectionContext for proper effect usage
      runInInjectionContext(this.injector, () => {
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
      });
    }
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
        dialogData = form.InfrastructureSignsForm;
      }
      dialogData = dialogData.map((row) => {
        row.row = row.row.map((field) => {
          if (field.name === 'signNumber') {
            return { ...field, disabled: isEdit }; // Disable in edit mode
          }
          return field;
        });
        return row;
      });
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          form: dialogData,
          title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle,
          isSigns: true,
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
                'form' in result && 'uploadedFiles' in result && 'isEdit' in result) {
              const updatedForm = { ...(result as any).form, imagePath: (result as any).uploadedFiles };
              const action = (result as any).isEdit
                ? InfrastructureTableAction.Update
                : InfrastructureTableAction.Add;
              this.handleInsertOrUpdate(updatedForm, action);
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
          isSignsExport: true,
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
  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Signs,
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
      includeInactive: this.includeInactive(),
    };
    const tableName = InfrastructureTablesTypes.Signs;
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

  async handleInsertOrUpdate(
    newType: SignsTypes,
    action: InfrastructureTableAction
  ) {
    try {
      const newData = this.transformSignData(newType);

      if (action === InfrastructureTableAction.Add) {
        delete newData.id;
      }
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newData,
        InfrastructureTablesTypes.Signs,
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
      const error = e as Error; // Explicitly cast the error
      if (error.message.includes('413'))
        this.toaster.error(ErrorSuccessMessages.FILE_SIZE_EXCEEDED);
      else this.toaster.error(ErrorSuccessMessages.DEFAULT);
      console.error(e);
    }
  }

  transformSignData(originalData: any): any {
    console.log(originalData.businessCity);
    return {
      id: originalData.id,
      signNumber: originalData.signNumber,
      signDescription: originalData.signDescription,
      area: originalData.area,
      length: originalData.length,
      width: originalData.width,
      isActive: originalData.isActive,
      latitude: originalData.latitude,
      longitude: originalData.longitude,
      imagePath: originalData.imagePath,
      Address: {
        City: {
          cityID: originalData.cityID.length
            ? Number(originalData.cityID[0])
            : null,
        },
        Street: {
          streetID: originalData.streetID ? Number(originalData.streetID) : '',
        },
        houseNumber: Number(originalData.houseNumber) || 0,
      },

      Business: {
        businessName: originalData.businessName || '',

        City: String(originalData.businessCity),
        Street: String(originalData.businessStreet),
        houseNumber: originalData.businessHouseNumber || '0',
        identification: originalData.cn || '',
      },

      Citizen: {
        Nid: originalData.nid || '',
        firstName: originalData.citizenFirstName || '',
        lastName: originalData.citizenLastName || '',
        citizenPhones: originalData.citizenPhones
          ? [{ Phone: originalData.citizenPhones, IsMain: true }]
          : [], // Convert single value to array

        homeAddress: {
          City: {
            cityID: Number(originalData.citizenCity),
          },
          Street: {
            streetID: Number(originalData.citizenStreet),
          },
          houseNumber: Number(originalData.citizenHouseNumber),
        },
      },

      authorityID: this.currentAuthority(),
    };
  }

  openEdit(rowData: SignsTypes) {
    console.log(rowData);
    // Extract data from address
    const address = rowData.address;
    // const streetID = address?.street?.streetName
    //   ? [address.street?.streetName]
    //   : [];

    const streetID = address?.street?.streetID
      ? [address.street?.streetID]
      : [];
    const houseNumber = address?.houseNumber;
    const cityID = address?.city?.cityID ? [address?.city?.cityID] : [];
    // Extract data from business
    const business = rowData.business;
    const businessName = business?.businessName || null;
    const businessStreet = Number(business?.street);
    const businessHouseNumber = business?.houseNumber;
    const businessCity = Number(business?.city);
    const businessIdentification = business?.identification;

    // Extract data from citizen
    const citizen = rowData.citizen;
    const nid = citizen?.nid;
    const citizenFirstName = citizen?.firstName;
    const citizenLastName = citizen?.lastName;
    const citizenAddresses = citizen?.citizenAddresses;
    const citizenPhones = citizen?.citizenPhones?.find(
      (phone: any) => phone.isMain
    )?.phone;

    const latitude = rowData.latitude;
    const longitude = rowData.longitude;

    const citizenStreet = citizen?.homeAddress?.streetID;
    const citizenHouseNumber = citizen?.homeAddress?.houseNumber;
    const citizenCity = citizen?.homeAddress?.cityID;

    // Map transformed data
    const transformedData = {
      ...rowData,
      longitude,
      latitude,
      streetID,
      houseNumber,
      cityID,
      businessName,
      businessStreet,
      businessHouseNumber,
      businessCity,
      businessIdentification,
      nid,
      citizenFirstName,
      citizenLastName,
      citizenAddresses,
      citizenPhones,

      citizenStreet,
      citizenHouseNumber,
      citizenCity,
    };

    // Update owner dialog data
    const updatedDialogData = this.dialogData().map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => ({
        ...field,
        value: (transformedData as any)[field.name] ?? field.value,
      })),
    }));
    this.dialogData.set(updatedDialogData);

    // Open the dialog form with transformed data
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
        includeInactive: this.includeInactive(),
      };
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Signs,
        this.currentAuthority()
      );
      if (response?.data) {
        const processedData = response.data.map((item: any) => {
          // Extract the street name from the address object
          const streetName = item.address?.street?.streetName;
          const cityID = item.address?.cityID;

          const streetID = item.address?.streetID;
          const citizenPhone = item.citizen?.citizenPhones?.[0]?.phone;

          // Extract the citizen phone from the citizen object
          // const citizenPhone = item.citizen?.citizenPhones?.find(
          //   (phone: any) => phone.isMain
          // )?.phone;

          return {
            ...item,
            streetName,
            citizenPhone,
            cityID,
            streetID,
          };
        });
        
        this.data.set(processedData);
        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
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

  async onCheckboxChange(includeInactive: boolean) {
    this.includeInactive.set(includeInactive);

    // Reset filter and update currentPage  value
    this.filter.set({ currentPage: 1, includeInactive });

    await this.loadData(this.filter());
  }
}
