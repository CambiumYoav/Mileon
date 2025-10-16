import { Utils } from '../../../utils/utils';
import { Component, OnInit, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
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
import { InfrastructureFilterOptions } from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureFormComponent } from '../infrastructure-form/infrastructure-form.component';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { UploadedFile } from '../../../types/uploadedFile';
import { Citizen } from '../../../types/citizen';
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
import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructures-citizens',
  templateUrl: './infrastructures-citizens.component.html',
  styleUrls: ['./infrastructures-citizens.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
    ButtonComponent
  ]
})
export class InfrastructuresCitizensComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title: string = TitlesEnum.InfrastructureCitizensTitle;
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
  infrastructureForm: FormGroup;
  list = signal<Citizen[]>([]);
  dialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  fileData: any;
  currentAuthority = signal<string | null>('');
  loader = signal<boolean>(false);
  citizenID = signal<any>('');
  
  // Prevent duplicate requests
  private lastLoadTime = 0;
  private readonly LOAD_DEBOUNCE_MS = 500;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      const SUPER_ID = '11111111-1111-1111-1111-111111111111';
      
      if (authorityID && authorityID !== SUPER_ID) {
        this.currentAuthority.set(authorityID);
        
        const now = Date.now();
        if (now - this.lastLoadTime < this.LOAD_DEBOUNCE_MS) {
          return;
        }
        this.lastLoadTime = now;
        
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
  }

  back() {
    this.routerService.back();
  }

  async ngOnInit(): Promise<void> {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.CitizenTable);
    const form = new InfrastructureForms();
    this.dialogData.set(form.InfrastructureCitizensForm);
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });
    
    if (this.authorityService.municipals().length === 0) {
      await this.authorityService.getMunicipals(1);
    }
    
    this.authorityService.setMunicipalsToNationalRegional();
  }
  
  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          isSignsImport: false,
          description:
            InfrastructureEnumDialogs.CitizensDialogImportDiscription,
        },  
      });

      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result !== undefined) {
            if (result && result.uploadedFiles) {
              // Process the returned files (e.g., save them, pass them to a service, etc.)
              this.filesToUpload.set(result.uploadedFiles);

              // Call the importData function to process the uploaded files
              this.importData();
            } else {
              console.log('Dialog was closed without uploading files.');
            }
            dialogEffectRef.destroy();
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
        dialogData = form.InfrastructureCitizensForm;
      }
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        data: { form: dialogData, title: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle, isEdit: isEdit },
      });
      
      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result) {
            const action = isEdit
              ? InfrastructureTableAction.Update
              : InfrastructureTableAction.Add;
            this.handleInsertOrUpdate(result, action);
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
        data: {
          description:
            InfrastructureEnumDialogs.CitizensDialogExportDiscription, // Dynamic text
        },
      });
      
      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result) {
            this.exportData();
            this.dialog.closeAll();
            dialogEffectRef.destroy();
          }
        });
      });
    }
  }

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Citizen,
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
    const tableName = InfrastructureTablesTypes.Citizen;
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
    newType: Citizen,
    action: InfrastructureTableAction
  ) {
    try {
      let newData = this.transformCitizenData(newType);
      if (action === InfrastructureTableAction.Update) {
        newData = this.transformUpdateCitizenData(newType);
      }
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        newData,
        InfrastructureTablesTypes.Citizen,
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

  openEdit(rowData: any) {
    // console.log(rowData);
    rowData.city = rowData.homeAddress.city.cityName;
    rowData.street = rowData.homeAddress.street.streetName;
    rowData.houseNumber = rowData.homeAddress.houseNumber;
    rowData.entrance = rowData.homeAddress.entrance;
    rowData.apartment = rowData.homeAddress.apartment;
    rowData.phone = rowData.citizenPhoneFormatted;
    rowData.postalCode = rowData.homeAddress.postalCode;
    rowData.mailbox = rowData.homeAddress.mailbox;

    if (rowData) this.citizenID.set(rowData.citizenID);
    this.dialogData.set(this.dialogData().map((dynamicRow) => {
      dynamicRow.row = dynamicRow.row.map((field) => {
        if (rowData[field.name] !== undefined) {
          return { ...field, value: rowData[field.name] };
        }
        return field;
      });
      return dynamicRow;
    }));
    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    if (this.loader()) {
      return;
    }
    
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
        searchText: currentFilter.searchText || '',
        currentPage: currentFilter.currentPage || 1,
      };

      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Citizen,
        this.currentAuthority(),
      );

      if (response?.data) {
        this.data.set(response.data.map((item: any) => ({
          ...item,
          homeAddressFormatted: item.homeAddress
            ? ` ${item.homeAddress.city.cityName || ''} ${
                item.homeAddress.street.streetName || ''
              } ${item.homeAddress.houseNumber || ''}${
                item.homeAddress.apartment
                  ? `, דירה ${item.homeAddress.apartment}`
                  : ''
              }`
            : 'N/A',
          citizenPhoneFormatted:
            item.citizenPhones?.find((phone: any) => phone.isMain)?.phone || 'N/A',
          city: item.homeAddress?.city.cityName || 'N/A',
        })));

        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
    } catch (e) {
      console.error(e);
    }
    
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }

  transformCitizenData(originalData: any): any {
    return {
      citizenCode: originalData.citizenCode,
      nid: originalData.nid,
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      phone: originalData.phone,
      email: originalData.email,
      citizenID: this.citizenID(),

      HomeAddress: {
        City: {
          cityName: originalData.city,
        },
        Street: {
          streetName: originalData.street,
        },
        houseNumber: Number(originalData.houseNumber) || 0,
        entrance: originalData.entrance,
        apartment: originalData.apartment,
        mailBox: originalData.mailBox,
        postalCode: originalData.postalCode,
      },

      authorityID: this.currentAuthority(),
    };
  }

  transformUpdateCitizenData(originalData: any): any {
    return {
      // citizenCode: originalData.citizenCode,
      nid: originalData.nid,
      firstName: originalData.firstName,
      lastName: originalData.lastName,
      phone: originalData.phone,
      email: originalData.email,
      citizenID: this.citizenID(),

      HomeAddress: {
        City: {
          cityName: originalData.city,
        },
        Street: {
          streetName: originalData.street,
        },
        houseNumber: Number(originalData.houseNumber) || 0,
        entrance: originalData.entrance,
        apartment: originalData.apartment,
        mailBox: originalData.mailBox,
        postalCode: originalData.postalCode,
      },

      authorityID: this.currentAuthority(),
    };
  }
}
