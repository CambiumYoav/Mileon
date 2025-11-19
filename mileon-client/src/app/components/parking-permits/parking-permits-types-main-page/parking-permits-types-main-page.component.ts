import { Component, effect, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { ModalMessages } from '../../../constants/modalMessages';
import { AuthorityService } from '../../../services/authority.service ';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ParkingPermitsService } from '../parking-permits.service';
import { ParkingPermitsSearchComponent } from '../parking-permits-search/parking-permits-search.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { ParkingPermitsTableComponent } from '../parking-permits-table/parking-permits-table.component';
import { AppModalComponent } from '../../shared/app-modal/app-modal.component';
import { CheckboxComponent } from '../../shared/base/checkbox/checkbox.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { ModalButton, ModalButtonsText } from '../../../constants/modalButtons';
import { Utils } from '../../../utils/utils';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { RouterService } from '../../../services/router.service';
import { ParkingPermitFilterOptions } from '../../../types/filters/parking-permit/parkingPermitFilterOptions';
import { UploadedFile } from '../../../types/uploadedFile';
import { ParkingPermitsSearchService } from '../parking-permits-search/parking-permits-search.service';
import { ParkingPermitsImportComponent } from '../parking-permits-import/parking-permits-import.component';
import { ParkingPermitAuthorityType } from '../../../../../src/app/types/parkingPermit/parkingPermitAuthorityType';
import { Buttons } from '../../../constants/buttonEnum';

@Component({
  selector: 'app-parking-permits-types-main-page',
  imports: [
    ParkingPermitsSearchComponent,
    ButtonComponent,
    ParkingPermitsTableComponent,
    AppModalComponent,
    CheckboxComponent,
    RouterOutlet,
  ],
  templateUrl: './parking-permits-types-main-page.component.html',
  styleUrl: './parking-permits-types-main-page.component.scss',
})
export class ParkingPermitsTypesMainPageComponent {
  // ===== Static/UI fields =====
  title: string = TitlesEnum.ParkingPermitsTypesMainTitle;
  updateTitle: string = ModalMessages.UPDATE_DRAFTS_AND_LETTERS;
  exportModalTitle: string = ModalMessages.EXPORT_FILE;
  SearchByTextEnum = SearchByTextEnum;
  Icons = ConstPath;
  Buttons= Buttons;

  // ===== Data & state =====
  data: ParkingPermitAuthorityType[] = [];
  total: number = 0;
  count: number = 0;
  searchText: string = '';
  list: any[] = [];
  parkingPermitForm: FormGroup;

  modalButtons: ModalButton[] = this.createModalButtons();
  isExportModalOpen: boolean = false;
  isImportModalOpen: boolean = false;

  loader: boolean = true;
  filter!: ParkingPermitFilterOptions;
  currentAuthority: string | null = null;
  includeInactive: boolean = false;
  selectedPermit: ParkingPermitAuthorityType | any | null = null;
  selectedParkingPermitData$: Subject<any> = new Subject<any>();
  filesToUpload: UploadedFile[] = [];

  // ===== Services via inject() =====
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  private readonly parkingPermitSearchService = inject(
    ParkingPermitsSearchService
  );
  private readonly routerService = inject(RouterService);
  private readonly parkingPermitsService = inject(ParkingPermitsService);
  private readonly dialog = inject(MatDialog);

  // Signal wrapper for authorityID$
  private readonly authorityId = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });

  constructor() {
    // Same as before – keep search form from service
    this.parkingPermitForm = this.parkingPermitSearchService.form;

    // React to authority changes instead of manual Subscription[]
    effect(() => {
      const authorityID = this.authorityId();
      if (!authorityID) return;

      this.currentAuthority =
        typeof authorityID === 'string' ? authorityID : null;
      this.loadData(this.parkingPermitSearchService.form.value);
    });
  }

  ngOnDestroy(): void {
    this.parkingPermitSearchService.clearForm();
  }

  async loadData(filter: any) {
    this.loader = true;
    console.log('loadData', filter);

    if (filter?.value) {
      filter = filter.value;
    }

    const MIN_LOADER_TIME = 1000;
    const startTime = Date.now();

    try {
      this.filter = { ...filter, pageSize: 100 };

      if (!this.currentAuthority) {
        this.loader = false;
        return;
      }

      const response = await this.parkingPermitsService.getParkingPermitTypes(
        this.currentAuthority,
        this.filter
      );

      if (response?.list) {
        this.data = response.list.map((permit: any) => ({
          ...permit,
          areaNames: permit.allAreasSelected ? 'כל העיר' : permit.areaNames,
        }));
        this.total = response.total;
        this.count = response.count;
      }
    } catch (e) {
      console.error(e);
    }

    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }

    this.loader = false;
  }

  async openDialogImport() {
    const dialogRef = this.dialog.open(ParkingPermitsImportComponent, {});

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.uploadedFiles) {
        this.filesToUpload = result.uploadedFiles;
        this.importData();
      } else {
        console.log('Dialog was closed without uploading files.');
      }
    });
  }

  async importData() {
    if (!this.currentAuthority) return;

    try {
      await this.parkingPermitsService
        .importPermitTypes(this.currentAuthority, this.filesToUpload)
        .then((res) => {
          if (res.errors) {
            this.toaster.error(
              ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
            );
          } else {
            this.toaster.success(ErrorSuccessMessages.UPLOADED_SUCCESSFULY);
            this.loadData(this.parkingPermitSearchService.form.value);
          }
        })
        .catch(() => {
          this.toaster.error(
            ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
          );
        });
    } catch (e) {
      console.error(e);
    }
  }

  exportParkingPermitTypes() {
    if (!this.currentAuthority) return;

    this.parkingPermitsService
      .exportParkingPermitTypes(
        this.currentAuthority,
        this.parkingPermitSearchService.form.value
      )
      .then((fileBlob) => {
        const fileName = `סוגי תווים-${new Date()
          .toISOString()
          .slice(0, 10)}.xlsx`;
        const file = new File([fileBlob], fileName, {
          type: FileTypeExtension.XLSX,
        });
        Utils.saveFile(file);
        this.toaster.success(ErrorSuccessMessages.DOWNLOADED_SUCCESSFULY);
      })
      .catch(() => {
        this.toaster.error(ErrorSuccessMessages.FAILED_EXPORT);
      });
  }

  async onCheckboxChange(event: boolean) {
    if (!this.filter || !this.filter.parkingPermitsOptionsFilter) {
      return;
    }

    if (event) {
      // Checkbox is checked -> Show inactive records as well
      this.filter.parkingPermitsOptionsFilter.isActive = true;
      this.includeInactive = true;
    } else {
      // Checkbox is unchecked -> Show only active
      this.filter.parkingPermitsOptionsFilter.isActive = false;
      this.includeInactive = false;
    }

    await this.loadData(this.filter);
  }

  createModalButtons(): ModalButton[] {
    return [
      {
        label: ModalButtonsText.Cancel,
        action: () => this.closeExportModal(),
        buttonClass: 'outline-secondary-btn',
      },
      {
        label: ModalButtonsText.Export,
        action: () => this.exportParkingPermitTypes(),
      },
    ];
  }

  closeExportModal() {
    this.isExportModalOpen = false;
  }

  openExportModal() {
    this.isExportModalOpen = true;
  }

  onRowChange(e: any) {
    
    this.navigateToUpdate(e.isActive, e.authorityPermitTypeID);
  }

  navigateToCreate() {
    this.routerService.navigateToUrl(
      [
        RP.ParkingPermits.Home,
        RP.ParkingPermits.Create,
        RP.ParkingPermits.CreateUpdateMain,
      ],
      true
    );
  }

  navigateToUpdate(isActive: boolean, id: string) {
    if (!id) return;

    this.routerService.navigateToUrl(
      [
        RP.ParkingPermits.Home,
        RP.ParkingPermits.Edit,
        RP.ParkingPermits.CreateUpdateMain,
        id,
        String(isActive),
      ],
      true
    );
  }

  back() {
    this.routerService.back();
  }
}
