import { Component, OnInit, signal, computed, effect, inject, runInInjectionContext, Injector } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
import { Citizen } from '../../../types/citizen';
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
  ChipsTypes,
  InfrastructureFilterOptions,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureImportComponent } from '../infrastructure-import/infrastructure-import.component';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructuresFormWrapperComponent } from '../infrastructures-form-wrapper/infrastructures-form-wrapper.component';
import { AnimalStatusEnum } from '../../../types/enum/animalStatusEnum';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { AuthorityService } from '../../../services/authority.service ';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { ResultsAfterImportComponent } from '../../shared/results-after-import/results-after-import.component';
import { RouterService } from '../../../services/router.service';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
  import { InfrastructureEnumDialogs, InfrastructureEnumTitles } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructures-chips',
  templateUrl: './infrastructures-chips.component.html',
  styleUrls: ['./infrastructures-chips.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
    ButtonComponent
  ]
})
export class InfrastructuresChipsComponent implements OnInit {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);
  private injector = inject(Injector);

  title: string = TitlesEnum.InfrastructureChipsTitle;
  Icons = ConstPath;
  SearchByTextEnum = SearchByTextEnum;
  mviewAuthority = '11111111-1111-1111-1111-111111111111';

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
  ownerDialogData = signal<DynamicRow[]>([]);
  petDialogData = signal<DynamicRow[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  fileData: any;
  obj: any;
  currentAuthority = signal<string | null>(null);
  loader = signal<boolean>(false);
  fileForFailedUsers = signal<string>('');
  fileNameForFailedUsers = signal<string>('');

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    
    const authorityIDSignal = toSignal(this.authorityService.authorityId$, { initialValue: null });
    
    effect(() => {
      const authorityID = authorityIDSignal();
      if (authorityID) {
        this.currentAuthority.set(authorityID);
        this.loadData(this.infrastructureSearchFormService.form);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.ChipsTable);

    const form = new InfrastructureForms();
    this.ownerDialogData.set(form.InfrastructureChipsOwnerForm);
    this.petDialogData.set(form.InfrastructureChipsPetForm);
    this.searchData.set({
      searchText: this.searchText(),
      order: 1,
      currentPage: 1,
    });
    this.filter.set({
      searchText: '', 
      currentPage: 1,
    });
    this.authorityService.setMunicipalsToNationalAdmin();
  }


  back() {
    this.routerService.back();
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        autoFocus: false,
        data: {
          description:
            InfrastructureEnumDialogs.ChipsDialogDiscription,
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
    let dialogComponent = InfrastructuresFormWrapperComponent;

    if (dialogComponent) {
      // Reset the dialog data if not editing
      let ownerDialogData = isEdit
        ? this.ownerDialogData()
        : new InfrastructureForms().InfrastructureChipsOwnerForm;
      let petDialogData = isEdit
        ? this.petDialogData()
        : new InfrastructureForms().InfrastructureChipsPetForm;

      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        // height: '745px',
        autoFocus: false,
        data: {
          mainTitle: isEdit ? InfrastructureEnumTitles.EditDialogTitle : InfrastructureEnumTitles.AddDialogTitle, // Dynamic title
          sections: [
            { 
              title: InfrastructureEnumTitles.OwnerDialogTitle, // Title for the owner section
              rows: ownerDialogData, // Fields for the owner section
            },
            {
              title: InfrastructureEnumTitles.PetDialogTitle, // Title for the pet section
              rows: petDialogData, // Fields for the pet section
            },
          ],
          isEdit: isEdit,
        },
      });

      const dialogInstance = dialogRef.componentInstance;

      runInInjectionContext(this.injector, () => {
        const afterClosedSignal = toSignal(dialogRef.afterClosed());
        const dialogEffectRef = effect(() => {
          const result = afterClosedSignal();
          if (result) {
            const action = isEdit
              ? InfrastructureTableAction.Update
              : InfrastructureTableAction.Add;
            this.handleInsertOrUpdate(result, action);

            // console.log(result);
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
        width: '614px',
        height: '307px',
        autoFocus: false,
        data: {
          description:  
            InfrastructureEnumDialogs.ChipsDialogExportDiscription,
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

  openAfterImportPopup(
    totalRecords: string,
    successfulRecords: string,
    errorRecords: string,
    title: string
  ): void {
    this.dialog.closeAll();
    let dialogComponent = ResultsAfterImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          totalRecords: totalRecords,
          successfulRecords: successfulRecords,
          errorRecords: errorRecords,
          title: title,
        },
      });
      // The ResultsAfterImportComponent is already refactored to Angular 19
      // and doesn't use dataSubject anymore. The dialog will close automatically
      // when the user clicks the buttons in the component.
    }
  }

  async importData() {
    try {
      const res = this.infrastructureServer
        .importDataByTableType(
          InfrastructureTablesTypes.Chips,
          this.filesToUpload(),
          this.mviewAuthority
        )
        .then((res) => {
          this.fileForFailedUsers.set(res.fileContent);
          this.fileNameForFailedUsers.set(res.fileName);
          if (res.errors) {
            this.toaster.error(
              ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
            );
          } else {
            this.loadData(this.infrastructureSearchFormService.form);
            this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
          }
          this.openAfterImportPopup(
            res.totalRows,
            res.successfulRows,
            res.failedRows,
            InfrastructureEnumDialogs.ChipsDialogImportDiscription,
          );
          // if (res.success) {
          //   this.loadData(this.infrastructureSearchFormService.form);
          //   this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
          // }
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
    // const filters = this.infrastructureSearchFormService.form.value.searchText;
    const filter = this.infrastructureSearchFormService.form.value.searchText;
    const filters = {
      ...filter,
      searchText: filter,
    };
    const tableName = InfrastructureTablesTypes.Chips;
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

  async handleInsertOrUpdate(newType: any, action: InfrastructureTableAction) {
    try {
      let processedData: any = {};

      processedData = {
        ...newType,
        chipNumber: Number(newType.chipNumber),
        chipID: Number(newType.chipID),
        animalNumber: Number(newType.animalNumber),
        houseNumber: Number(newType.houseNumber),
        genderId: Number(newType.genderId),
        animalStatusId: Number(newType.animalStatusId),
        city: 0,
        streetID: 0,
        address: {
          streetID: 0,
          cityID: newType.cityID,
          houseNumber: Number(newType.houseNumber),
          postalCode: newType.postalCode || null,
          entrance: newType.entrance || null,
          apartment: newType.apartment || null,
          mailbox: newType.mailbox || null,
          cityName: newType.city,
          street: {
            streetID: newType.streetID,
            // streetName: newType.streetID,
            previousStreetName: '',
            streetCode: '',
            authorityID: null,
            cityID: 0,
            cityCode: '',
            areaID: null,
            automationCode: '',
            parkingAutomationCode: '',
            businessAutomationCode: '',
            isActive: false,
            sendToDevice: false,
            authority: null,
            city: {
              cityID: newType.cityID,
              // cityName: newType.city,
            },
          },
          city: {
            cityID: newType.city,
            // cityName: newType.city,
          },
        },
      };

      if (processedData.animalStatusId === 0) {
        processedData.animalStatusId = 6;
      }
      if (action === InfrastructureTableAction.Add) {
        delete processedData.addressId;
        delete processedData.address.addressId;
      }
      // console.log(processedData);
      const result = await this.infrastructureServer.insertToTypeTableDynamic(
        processedData,
        InfrastructureTablesTypes.Chips,
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

  getTypeMapping(): { [key: string]: number } {
    return Object.fromEntries(
      Object.keys(AnimalStatusEnum)
        .filter((key) => isNaN(Number(key))) // Filter out numeric keys
        .map((key) => [
          key.replace(/_/g, ' '), // Replace underscores with spaces in the key
          AnimalStatusEnum[key as keyof typeof AnimalStatusEnum], // Get the numeric value
        ])
    );
  }

  openEdit(rowData: ChipsTypes) {
    // console.log(rowData);
    const typeMapping = this.getTypeMapping();

    const addressParts = this.extractAddressComponents(rowData.fullAddress);

    const transformedData = {
      ...rowData,
      animalStatusId:
        typeMapping[rowData.animalStatusId!] !== undefined
          ? typeMapping[rowData.animalStatusId!]
          : rowData.animalStatusId,
      animalNumber: Number(rowData.animalNumber),
      streetName: addressParts.street,
      houseNumber: rowData.address?.houseNumber,
      cityName: addressParts.city,
      apartment: rowData.address?.apartment,
      city: rowData.address?.cityID,
      streetID: rowData.address?.streetID,
    };
    // console.log(transformedData);
    this.ownerDialogData.set(this.ownerDialogData().map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => ({
        ...field,
        value: (transformedData as any)[field.name] ?? field.value,
      })),
    })));

    this.petDialogData.set(this.petDialogData().map((dynamicRow) => ({
      ...dynamicRow,
      row: dynamicRow.row.map((field) => ({
        ...field,
        value: (transformedData as any)[field.name] ?? field.value,
      })),
    })));
    this.obj = transformedData;
    this.openDialogForm(true);
  }

  private extractAddressComponents(fullAddress?: string): {
    street: string;
    houseNumber: string;
    city: string;
  } {
    if (fullAddress) {
      const regex = /^(.*?)\s(\d+),\s(.*)$/; // Regex to extract street, house number, and city
      const match = fullAddress.match(regex);

      return {
        street: match?.[1] || '',
        houseNumber: match?.[2] || '',
        city: match?.[3] || '',
      };
    }
    return {
      street: 'Unknown Street',
      houseNumber: 'Unknown House Number',
      city: 'Unknown City',
    };
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
      };
      const response = await this.infrastructureServer.getInfrastructureTable(
        updatedFilter,
        InfrastructureTablesTypes.Chips
        // this.currentAuthority
      );
      if (response?.data) {
        // Map the response to manipulate the address object
        this.data.set(response.data.map((item: any) => {
          // console.log(item);
          const streetName = item.address?.street?.streetName;
          const houseNumber = item.address?.houseNumber;
          const cityName = item.address?.city?.cityName;
          const cityId = item.address?.cityID;
          // console.log(cityId);
          // Create a full address string
          const fullAddress =
            `${streetName} ${houseNumber}, ${cityName}`.trim();

          // Return the updated object
          return {
            ...item,
            streetName, // Add streetName directly if needed
            fullAddress, // Include the full address if necessary
            cityId,
          };
        }));

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
}
