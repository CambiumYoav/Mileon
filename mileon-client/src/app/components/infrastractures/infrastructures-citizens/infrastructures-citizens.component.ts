import { Utils } from '../../../utils/utils';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
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

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const authorityID = this.authorityService.authorityId();
      const SUPER_ID = '11111111-1111-1111-1111-111111111111';
      
      if (authorityID && authorityID !== SUPER_ID) {
        this.currentAuthority.set(authorityID);
        
        if (InfrastructuresUtils.shouldDebounce(this.lastLoadTime)) {
          return;
        }
        this.lastLoadTime = Date.now();
        
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
    
    // Initialize search and filters using utility
    const { searchData, filter } = InfrastructuresUtils.initializeSearchAndFilters(
      this.searchText()
    );
    this.searchData.set(searchData);
    this.filter.set(filter);
    
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
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        InfrastructureTablesTypes.Citizen,
        this.filesToUpload(),
        this.currentAuthority()!
      ),
      this.toaster,
      () => this.loadData(this.infrastructureSearchFormService.form)
    );
  }

  async exportData(): Promise<void> {
    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { authorityID: this.currentAuthority() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      InfrastructureTablesTypes.Citizen,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
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
        await this.loadData(this.infrastructureSearchFormService.form);
        InfrastructuresUtils.handleInsertUpdateSuccess(action, this.toaster, this.dialog);
      }
    } catch (error) {
      InfrastructuresUtils.handleInsertUpdateError(error, this.toaster);
    }
  }

  openEdit(rowData: any) {
    rowData.city = rowData.homeAddress?.city?.cityName;
    rowData.street = rowData.homeAddress?.street?.streetName;
    rowData.houseNumber = rowData.homeAddress?.houseNumber;
    rowData.entrance = rowData.homeAddress?.entrance;
    rowData.apartment = rowData.homeAddress?.apartment;
    rowData.phone = rowData.citizenPhoneFormatted;
    rowData.postalCode = rowData.homeAddress?.postalCode;
    rowData.mailbox = rowData.homeAddress?.mailbox;

    if (rowData) this.citizenID.set(rowData.citizenID);
    
    // Map row data to dialog fields using utility
    const updatedDialogData = InfrastructuresUtils.mapRowDataToDialogFields(
      this.dialogData(),
      rowData
    );
    this.dialogData.set(updatedDialogData);
    
    this.openDialogForm(true);
  }

  async loadData(filter: any) {
    if (this.loader()) {
      return;
    }
    
    this.loader.set(true);
    
    filter = InfrastructuresUtils.normalizeFilter(filter);
    
    const startTime = Date.now();
    
    try {
      const searchText = this.infrastructureSearchFormService.form.value.searchText;
      
      const updatedFilter = InfrastructuresUtils.prepareLoadDataFilters(
        this.filter(),
        filter,
        searchText
      );
      
      this.filter.set(updatedFilter);

      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Citizen,
        this.currentAuthority(),
      );

      if (response?.data) {
        this.data.set(response.data.map((item: any) => ({
          ...item,
          homeAddressFormatted: item.homeAddress
            ? InfrastructuresUtils.formatAddress(item.homeAddress)
            : 'N/A',
          citizenPhoneFormatted: InfrastructuresUtils.extractMainPhone(item.citizenPhones),
          city: item.homeAddress?.city?.cityName || 'N/A',
        })));

        this.total.set(response.totalRecords);
        this.count.set(response.data.length);
      }
    } catch (error) {
      InfrastructuresUtils.handleError(error, 'loadData');
    }
    
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
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
