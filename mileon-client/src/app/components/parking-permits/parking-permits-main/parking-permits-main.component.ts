import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActionButtonsComponent } from '../../shared/action-buttons/action-buttons.component';
import { ParkingPermitsSearchComponent } from '../parking-permits-search/parking-permits-search.component';
import { ParkingPermitsTableComponent } from '../parking-permits-table/parking-permits-table.component';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AppModalComponent } from '../../shared/app-modal/app-modal.component';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ActionButtonNames } from '../../../constants/action_buttons';
import { ConstPath } from '../../../constants/const_path';
import { ModalButton } from '../../../constants/modalButtons';
import { ModalMessages } from '../../../constants/modalMessages';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { AuthorityService } from '../../../services/authority.service ';
import { PermissionService } from '../../../services/permission.service';
import { RouterService } from '../../../services/router.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { FileTypeExtension } from '../../../types/enum/fileType.enum';
import { ModuleEnum, RoleEnum } from '../../../types/enum/moduleEnum';
import { ParkingPermitStatusEnum } from '../../../types/enum/parkingPermitStatusEnums';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { ParkingPermitFilterOptions } from '../../../types/filters/parking-permit/parkingPermitFilterOptions';
import { MyRef } from '../../../types/myRef';
import { ParkingPermitMenus } from '../../../types/parkingPermit/parking-permit-menus.model';
import { ParkingPermitsButtonsModel } from '../../../types/parkingPermit/parking-permits-buttons.model';
import { ParkingPermit } from '../../../types/parkingPermit/parkingPermit';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { ParkingPermitsSearchService } from '../parking-permits-search/parking-permits-search.service';
import { ParkingPermitsService } from '../parking-permits.service';
import { Buttons as ActionButtonsEnum } from '../../../constants/buttonEnum';
import { ParkingPermitsImportComponent } from '../parking-permits-import/parking-permits-import.component';

@Component({
  selector: 'app-parking-permits-main',
  templateUrl: './parking-permits-main.component.html',
  styleUrl: './parking-permits-main.component.scss',
  imports: [
    ActionButtonsComponent,
    ParkingPermitsSearchComponent,
    ParkingPermitsTableComponent,
    ButtonComponent,
    AppModalComponent,
  ],
})
export class ParkingPermitsMainComponent implements OnInit, AfterViewInit {
  // Inject services
  private parkingPermitsService = inject(ParkingPermitsService);
  private routerService = inject(RouterService);
  private permissionService = inject(PermissionService);
  public parkingPermitSearchService = inject(ParkingPermitsSearchService);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private authorityService = inject(AuthorityService);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private destroyRef = inject(DestroyRef);

  // Constants
  readonly SearchByTextEnum = SearchByTextEnum;
  readonly Icons = ConstPath;
  readonly moduleEnum = ModuleEnum;

  // Signals for reactive state
  list = signal<ParkingPermit[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  error = signal<string>('');
  title = signal<string>(ParkingPermitMenus.parkingPermitDefaultTitle);
  loader = signal<boolean>(true);
  parkingPermitID = signal<string>('');
  currentParkingPermitData = signal<ParkingPermit | null>(null);
  actionButtonsList = signal<ActionButtonNames[]>([]);
  isBackOffice = signal<boolean>(false);
  disableButtons = signal<boolean>(true);
  role = signal<string | null>('');
  isExportModalOpen = signal<boolean>(false);
  isRenewModalOpen = signal<boolean>(false);
  filesToUpload = signal<UploadedFile[]>([]);

  // Convert Observable to Signal
  currentAuthority = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });

  // Subject for selected parking permit (keep as Subject for now)
  selectedParkingPermitData$ = new Subject<ParkingPermit>();

  // Non-signal properties
  emailAddress: MyRef<string> = { current: '' };
  phoneNumber: MyRef<string> = { current: '' };
  exportModalTitle: string = ModalMessages.EXPORT_FILE;
  renewModalTitle: string = ModalMessages.RENEW_PARKING_PERMITS;
  modalButtons: ModalButton[] = this.createModalButtons();
  renewModalButtons: ModalButton[] = this.createRenewModalButtons();

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  constructor() {
    // Initialize action buttons based on role
    const userRole = this.permissionService.role();
    this.isBackOffice.set(userRole === RoleEnum.BACK_OFFICE);
    this.initActionButtons();

    // React to authority changes
    effect(() => {
      const authorityID = this.currentAuthority();
      if (authorityID !== null) {
        this.loadData(this.parkingPermitSearchService.form.value);
      }
    });

    // // Subscribe to selected parking permit data with automatic cleanup
    // this.selectedParkingPermitData$
    //   .pipe(takeUntilDestroyed())
    //   .subscribe((updatedData) => {
    //     if (updatedData && Object.keys(updatedData).length > 0) {
    //       this.emailAddress.current = updatedData.citizen?.email ?? '';
    //       // this.phoneNumber.current =

    //       //   updatedData['citizen.mainPhone'] ??
    //       //   updatedData['citizen.mainPhone'];
    //       this.actionButtonsComponent?.toggleDisabled(
    //         this.actionButtonsList(),
    //         false
    //       );
    //       this.parkingPermitID.set(
    //         updatedData['parkingPermitID'] ?? updatedData['parkingPermitID']
    //       );
    //       console.log(this.parkingPermitID());
    //       this.disableButtons.set(false);
    //       this.checkIfParkingPermitIsPayable(
    //         updatedData.cost,
    //         updatedData.parkingPermitStatus?.statusId
    //       );
    //     } else {
    //       this.disableButtons.set(true);
    //     }
    //   });

    // Setup cleanup on destroy
    this.destroyRef.onDestroy(() => {
      this.disableButtons.set(true);
      this.parkingPermitSearchService.clearForm();
    });
  }

  ngOnInit(): void {
    this.title.set(
      this.routerService.getCurrentState().name ||
        ParkingPermitMenus.parkingPermitDefaultTitle
    );
    this.role.set(this.permissionService.role());

    const extraParams = history.state?.data?.extraParams;
    this.authorityService.setMunicipalsToNationalRegional();

    // Load initial data
    if (extraParams?.source == 'parkingPermit' || this.isBackOffice()) {
      this.loadData(this.parkingPermitSearchService.form.value);
    } else {
      this.loadData(this.parkingPermitSearchService.form.value);
    }
  }

  ngAfterViewInit(): void {
    // Only enable buttons that should always be available
    this.actionButtonsComponent?.toggleDisabled(['RenewParkingPermits'], false);
    this.changeDetectorRef.detectChanges();
  }

  initActionButtons(): void {
    if (this.isBackOffice()) {
      this.actionButtonsList.set(
        ParkingPermitsButtonsModel.BackOfficeActionButtons
      );
    } else {
      this.actionButtonsList.set(
        ParkingPermitsButtonsModel.DispatcherActionButtons
      );
    }
  }

  toggleButtonsByRecord(e: any) {
    this.actionButtonsComponent?.toggleDisabled(
      this.actionButtonsList(),
      false
    );
    this.parkingPermitID.set(e.parkingPermitID);
    this.disableButtons.set(false);
    this.checkIfParkingPermitIsPayable(e.cost, e.statusId);
  }

  checkIfParkingPermitIsPayable(cost: number, status?: number): void {
    if (cost <= 0 || status !== ParkingPermitStatusEnum.AwaitingPayment) {
      this.actionButtonsComponent?.toggleDisabled(['Payment'], true);
    }
  }

  toggleButtons(btnStatus: boolean): void {
    this.actionButtonsComponent.toggleDisabled(
      this.actionButtonsList(),
      btnStatus
    );
  }

  async loadData(filter: ParkingPermitFilterOptions): Promise<void> {
    this.loader.set(true);

    try {
      const updatedFilter = {
        ...filter,
        orderByField: 'requestDate',
        pageSize: 100,
        parkingPermitsOptionsFilter: {
          ...filter.parkingPermitsOptionsFilter,
          authorityIDs: [this.currentAuthority()],
        },
      };

      const res = await this.parkingPermitsService.fetchParkingPermitsList(
        updatedFilter
      );

      if (res && res.list) {
        this.list.set(res.list.map((p) => new ParkingPermit(p, true)));
        this.total.set(res.list.length ? res.total : 0);
        this.count.set(res.count);
      }

      if (res?.total == 0) {
        this.disableButtons.set(true);
        this.actionButtonsComponent?.toggleDisabled(
          ['RenewParkingPermits'],
          true
        );
        this.actionButtonsComponent?.toggleDisabled(['ExportToExcel'], true);
      } else {
        this.actionButtonsComponent?.toggleDisabled(
          ['RenewParkingPermits'],
          false
        );
        this.actionButtonsComponent?.toggleDisabled(['ExportToExcel'], false);
      }
    } catch (e) {
      console.error(e);
    }

    this.loader.set(false);
  }

  goBackToPreviousPage(): void {
    this.parkingPermitSearchService.clearForm();
    this.routerService.navigateToSetUrl(
      `/home/${this.role()}/${ROUTE_PATH.ParkingPermits.Home}/${
        ROUTE_PATH.ParkingPermits.Main
      }`
    );
  }

  clearAll(): void {
    this.title.set(ParkingPermitMenus.parkingPermitDefaultTitle);
    this.parkingPermitSearchService.clearForm();
  }

  goToDetails(parkingPermit: ParkingPermit): void {
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.ParkingPermits.Home,
        parkingPermit.parkingPermitID,
        ROUTE_PATH.ParkingPermits.Details,
      ],
      true
    );
  }

  handleAction(actionBtn: any): void {
    switch (actionBtn) {
      case ActionButtonsEnum.ExportToExcel:
        this.openExportModal();
        break;
      case ActionButtonsEnum.ImportFromExcel:
        this.openDialogImport();
        break;
      case ActionButtonsEnum.RenewParkingPermits:
        this.openRenewModal();
        break;
      default:
        return;
    }
  }

  openRenewModal(): void {
    this.isRenewModalOpen.set(true);
  }

  closeRenewModal(): void {
    this.isRenewModalOpen.set(false);
  }

  openExportModal(): void {
    this.isExportModalOpen.set(true);
  }

  closeExportModal(): void {
    this.isExportModalOpen.set(false);
  }

  createModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeExportModal(),
        buttonClass: 'outline-secondary-btn',
      },
      { label: 'ייצוא', action: () => this.exportParkingPermits() },
    ];
  }

  createRenewModalButtons(): ModalButton[] {
    return [
      {
        label: 'ביטול',
        action: () => this.closeExportModal(),
        buttonClass: 'outline-secondary-btn',
      },
      { label: 'חידוש', action: () => this.renewParkingPermits() },
    ];
  }

  renewParkingPermits(): void {
    const userId = this.permissionService.userId();

    const updatedFilter = {
      ...this.parkingPermitSearchService.form.value,
      orderByField: 'requestDate',
      parkingPermitsOptionsFilter: {
        ...this.parkingPermitSearchService.form.value
          .parkingPermitsOptionsFilter,
        authorityIDs: [this.currentAuthority()],
      },
    };
    this.parkingPermitsService.renewParkingPermitTrigger(userId, updatedFilter);
  }

  async exportParkingPermits(): Promise<void> {
    try {
      const filter = {
        ...this.parkingPermitSearchService.form.value,
        orderByField: 'requestDate',
        pageSize: 150,
        parkingPermitsOptionsFilter: {
          ...this.parkingPermitSearchService.form.value
            .parkingPermitsOptionsFilter,
          authorityIDs: [this.currentAuthority()],
        },
      };

      await this.parkingPermitsService
        .exportParkingPermits(filter)
        .then((fileBlob) => {
          const fileName = `תווי חנייה -${new Date()
            .toISOString()
            .slice(0, 10)}.xlsx`;
          const file = new File([fileBlob], fileName, {
            type: FileTypeExtension.XLSX,
          });
          Utils.saveFile(file);
        });
    } catch (error) {
      console.error('Export error:', error);
    }
  }

  async openDialogImport(): Promise<void> {
    const dialogComponent = ParkingPermitsImportComponent;
    if (dialogComponent) {
      const dialogRef = this.dialog.open(dialogComponent, {
        data: {
          description:
            'סוג תו, שם פרטי, שם משפחה,תעודת זהות, תאריך לידה, טלפון נייד, דואר אלקטרוני, ישוב, רחוב,מספר בית, דירה ,כניסה ,מיקוד ,ת.ד. , מספר רישוי, סוג רכב, צבע רכב, יצרן רכב, הערות, אישור הצהרה (0/1), אישור פרטים (0/1) , קבלת תזכורות (0/1),',
        },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.uploadedFiles) {
          this.filesToUpload.set(result.uploadedFiles);
          this.importData();
        } else {
          console.log('Dialog was closed without uploading files.');
        }
      });
    }
  }

  async importData(): Promise<void> {
    try {
      const res = this.parkingPermitsService
        .importParkingPermits(this.currentAuthority()!, this.filesToUpload())
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
        .catch((error) => {
          this.toaster.error(
            ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER
          );
        });
    } catch (e) {
      console.error(e);
    }
  }
}
