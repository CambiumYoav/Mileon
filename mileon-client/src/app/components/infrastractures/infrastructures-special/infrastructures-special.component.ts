import { Component, signal, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConstPath } from '../../../constants/const_path';
import { InfrastructureTablesTypes } from '../../../types/enum/infrastructureTablesEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureTable,
  InfrastructureSpecialTableTypes,
} from '../../../types/infrastructure/infrastructure-table.model';
import {
  InfrastructureFilterOptions,
  StreetsTypes,
} from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { Utils } from '../../../utils/utils';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
import { InfrastructureExportComponent } from '../infrastructure-export/infrastructure-export.component';
import { InfrastructureService } from '../infrastructure.service';
import { UploadedFile } from '../../../types/uploadedFile';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { InfrastructureSpecialImportComponent } from '../infrastructure-special-import/infrastructure-special-import.component';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { AuthorityService } from '../../../services/authority.service ';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { RouterService } from '../../../services/router.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InfrastructuresSearchComponent } from '../infrastructures-search/infrastructures-search.component';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';
import { InfrastructuresDisabledComponent } from '../infrastructures-disabled/infrastructures-disabled.component';
import { InfrastructuresPublicComponent } from '../infrastructures-public/infrastructures-public.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InfrastructureEnumDialogs } from '../../../types/enum/infrastructure.enum';

@Component({
  selector: 'app-infrastructures-special',
  templateUrl: './infrastructures-special.component.html',
  styleUrls: ['./infrastructures-special.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    ButtonComponent,
    InfrastructuresSearchComponent,
    InfrastructuresTableComponent,
    InfrastructuresDisabledComponent,
    InfrastructuresPublicComponent,
    InputDateComponent,
    SelectComponent
  ]
})
export class InfrastructuresSpecialComponent implements OnInit, OnDestroy {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);
  private routerService = inject(RouterService);

  title = signal<string>(TitlesEnum.InfrastructureSpecialTitle);
  SearchByTextEnum = SearchByTextEnum;
  Icons = ConstPath;
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
  filter = signal<FilterOptions | undefined>(undefined);
  list = signal<StreetsTypes[]>([]);
  vehicleType = signal<InfrastructureTablesTypes | undefined>(undefined);
  types = InfrastructureSpecialTableTypes;
  selectedType = signal<string>('');
  filesToUpload = signal<UploadedFile[]>([]);
  isDisabled = signal<boolean>(false);
  isPublic = signal<boolean>(false);
  isSelected = signal<boolean>(false);
  selectedTable = signal<string>('');
  totalRecords = signal<number>(0);
  loader = signal<boolean>(false);
  isImported = signal<boolean>(false);
  isImportDisabled = signal<boolean>(true);
  dateValue = signal<string | Date>('');
  
  infrastructureForm: FormGroup;
  lastUpdate: FormControl;
  type: FormControl;
  form: FormGroup;
  
  lastUpdateValue!: any;

  constructor() {
    this.infrastructureForm = this.infrastructureSearchFormService.form;
    this.lastUpdate = new FormControl(null);
    this.type = new FormControl('');
    this.form = new FormGroup({
      lastUpdate: this.lastUpdate,
      type: this.type,
    });
    
    this.lastUpdateValue = toSignal(this.lastUpdate.valueChanges);
    const typeValue = toSignal(this.type.valueChanges);
    
    effect(() => {
      const value = this.lastUpdateValue();
      if (value) {
        const dateValue = new Date(value);
        const formattedDate = this.formatDate(dateValue);
        this.dateValue.set(formattedDate);
      }
    });

    effect(() => {
      const value = typeValue();
      if (value) {
        this.changeType({ value });
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.SpecialsDisabledTable);
    // this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();
  }

  back() {
    this.routerService.back();
  }

  formatDate(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }

  async openDialogExport() {
    let dialogComponent = InfrastructureExportComponent;
    let description = this.isDisabled()
      ? InfrastructureEnumDialogs.SpecialDialogExportDisabledDiscription
      : InfrastructureEnumDialogs.SpecialDialogExportPublicDiscription;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        // width: '835px',
        // height: '300px',
        autoFocus: false,
        data: {
          description: description,
        },
      });
      const dialogInstance = dialogRef.componentInstance;

      effect(() => {
        const result = dialogInstance.dataSubject();
        if (result) {
          this.exportData();
          this.dialog.closeAll();
        }
      });
    }
  }

  async openDialogImport() {
    let dialogComponent = InfrastructureSpecialImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {},
      });

      const dialogClosed = toSignal(dialogRef.afterClosed());
      effect(() => {
        const result = dialogClosed();
        if (result && result.uploadedFiles) {
          this.filesToUpload.set(result.uploadedFiles);
          if (result.selectedType == InfrastructureTablesTypes.Public) {
            this.vehicleType.set(InfrastructureTablesTypes.Public);
            this.importData();
          } else if (
            result.selectedType == InfrastructureTablesTypes.Disabled
          ) {
            this.vehicleType.set(InfrastructureTablesTypes.Disabled);
            this.importData();
          }
        }
      });
    }
  }

  triggerSearch(filter: any) {
    this.searchText.set(
      this.infrastructureSearchFormService.form.value.searchText
    );
  }

  changeType(event: any): void {
    if (!event?.value) return;

    this.selectedType.set(event.value);

    this.isDisabled.set(this.selectedType() === InfrastructureTablesTypes.Disabled);
    this.isPublic.set(this.selectedType() === InfrastructureTablesTypes.Public);
    this.isSelected.set(this.isPublic() || this.isDisabled());
  }

  async exportData(): Promise<void> {
    let tableName: any = null;

    if (this.selectedTable() === InfrastructureTablesTypes.Public) {
      tableName = InfrastructureTablesTypes.PublicVehicles;
    } else if (this.selectedTable() === InfrastructureTablesTypes.Disabled) {
      tableName = InfrastructureTablesTypes.DisabledVehicleBadge;
    }

    if (!tableName) {
      console.error('Error: Table name is not defined for the selected type.');
      this.toaster.error(ErrorSuccessMessages.DEFAULT);
      return;
    }

    const filters = InfrastructuresUtils.prepareExportFilters(
      this.infrastructureSearchFormService.form.value.searchText,
      { date: this.dateValue() }
    );

    await InfrastructuresUtils.handleExportData(
      filters,
      tableName,
      this.infrastructureServer.exportTableData.bind(this.infrastructureServer),
      this.toaster
    );
  }
  setType(type: InfrastructureTablesTypes) {
    this.selectedTable.set(type);
  }

  getTotalRecords(total: number) {
    this.totalRecords.set(total);
    
    const searchText = this.infrastructureSearchFormService.form.value.searchText?.trim() || '';
    this.isImportDisabled.set(
      !InfrastructuresUtils.shouldDisableImport(total, searchText)
    );
  }

  async importData() {
    const vehicleType = this.vehicleType();
    if (!vehicleType) return;
    
    await InfrastructuresUtils.handleImportData(
      () => this.infrastructureServer.importDataByTableType(
        vehicleType,
        this.filesToUpload()
      ),
      this.toaster,
      () => { this.isImported.set(true); }
    );
  }
}
