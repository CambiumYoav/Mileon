import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ModalButton } from '../../../constants/modalButtons';
import { TicketPaymentBalance } from '../../../types/payments/payment';
import { ROUTE_PATH } from '../../../constants/routerPath';
import ParkingPermits = ROUTE_PATH.ParkingPermits;
import { ActionAttributes } from '../../../constants/action_buttons';
import { Buttons } from '../../../constants/buttonEnum';
import { ConstPath } from '../../../constants/const_path';
import { LegalRequestTypeMappingToString } from '../../../constants/legal-request-type-mapping';
import { PermissionRoutes } from '../../../constants/permissions.enum';
import { ActionService } from '../../../services/action.service';
import { PermissionService } from '../../../services/permission.service';
import { RouterService } from '../../../services/router.service';
import { ModuleEnum } from '../../../types/enum/moduleEnum';
import { MyRef } from '../../../types/myRef';
import { Buttons as ActionButtonsEnum } from '../../../constants/buttonEnum';
import { ButtonComponent } from '../base/button/button.component';
import { SmsDialogComponent } from '../sms-dialog/sms-dialog.component';

@Component({
  selector: 'app-action-buttons',
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
  imports: [ButtonComponent],
  standalone: true,
})
export class ActionButtonsComponent implements OnInit, OnChanges {
  // Inject services
  private actionService = inject(ActionService);
  public dialog = inject(MatDialog);
  private _router = inject(Router);
  private routerService = inject(RouterService);
  private permissionsService = inject(PermissionService);

  // Constants
  readonly icons = ConstPath;
  readonly ActionButtonsEnum = ActionButtonsEnum;
  readonly ModuleEnum = ModuleEnum;

  // Signals for reactive state
  allowedButtons = signal<ActionAttributes[]>([]);
  isTicketPaymentModalOpen = signal<boolean>(false);
  isNewLegalRequestModalOpen = signal<boolean>(false);
  legalRequestModalButtons = signal<ModalButton[]>([]);
  legalRequestType = signal<string>('');
  LegalRequestTypeOptions = signal<{ id: string; value: string }[]>([]);
  activeTicketAction = signal<string>('');
  modalButtons = signal<ModalButton[]>([]);
  microphoneSvg = signal<string>('');
  role = signal<string | null>('');

  // Input/Output properties
  @Output() action = new EventEmitter<string>();
  @Output() amountData?: TicketPaymentBalance;

  @Input() errorContent: string = '';
  @Input() buttonsList: string[] = [];
  @Input() recordId: string = '';
  @Input() recordData: any;
  @Input() phoneNumber: MyRef<string> = { current: '' };
  @Input() moduleEnum!: ModuleEnum;
  @Input() emailAddress: MyRef<string> = { current: '' };
  @Input() disableUntilSet: boolean = false;

  constructor() {
    // React to role changes
    effect(() => {
      const userRole = this.permissionsService.role();
      this.role.set(userRole);
    });
  }

  ngOnInit(): void {
    this.initButtons();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['recordId'] && !changes['recordId'].firstChange) {
      this.recordId = changes['recordId'].currentValue;
    }
    
    // Re-initialize buttons when buttonsList changes
    if (changes['buttonsList'] && !changes['buttonsList'].firstChange) {
      this.initButtons();
    }
  }

  initButtons(): void {
    const buttons: ActionAttributes[] = [];
    this.buttonsList.forEach((btn) => {
      buttons.push(
        this.actionService.buttons[
          btn as keyof typeof this.actionService.buttons
        ]
      );
    });
    this.allowedButtons.set(buttons);
  }

  toggleDisabled(buttonKeys: string[], btnStatus: boolean = false): void {
    const btns = this.actionService.buttons;
    
    for (const key in btns) {
      if (buttonKeys.includes(key)) {
        btns[key as keyof typeof btns].disabled = btnStatus;
        btns[key as keyof typeof btns].isDisabled = btnStatus;
      }

      // Handle button disabled based on user permissions
      switch (btns[key as keyof typeof btns].text) {
        case Buttons.SendEmail:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.ACTION_EMAIL
            );
          break;

        case Buttons.PrintToPDF:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.ACTION_PRINT
            );
          break;

        case Buttons.SendToPhone:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.ACTION_SMS
            );
          break;

        case Buttons.AddReminder:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.USER_NOTES
            );
          break;

        case Buttons.Payment:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.PAYMENTS_IFRAME
            );
          break;

        case Buttons.NewRequest:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.LEGAL_REQUEST_BY_TICKET_NUMBER
            );
          break;

        case Buttons.ExportTestFile:
        case Buttons.ExportToExcel:
        case Buttons.RenewParkingPermits:
          btns[key as keyof typeof btns].disabled =
            !this.permissionsService.checkUserPermission(
              PermissionRoutes.ACTION_SMS
            );
          break;

        default:
          break;
      }
    }
    
    // Update allowed buttons signal after permission checks
    this.initButtons();
  }

  initIcons(): void {
    this.microphoneSvg.set(ConstPath.MICROPHONE);
  }

  openDialog(action: ActionButtonsEnum): void {
    let dialogComponent;
    let dialogData;

    switch (action) {
      // case ActionButtonsEnum.SendEmail:
      //   dialogComponent = SendEmailDialogComponent;
      //   dialogData = {
      //     recordId: this.recordId,
      //     moduleEnum: this.moduleEnum,
      //     emailAddress: this.emailAddress.current,
      //   };
      //   break;

      case ActionButtonsEnum.SendToPhone:
        dialogComponent = SmsDialogComponent;
        dialogData = {
          recordId: this.recordId,
          moduleEnum: this.moduleEnum,
          phoneNumber: this.phoneNumber.current,
          updateCitizenPhoneNumber: false,
        };
        break;

      // case ActionButtonsEnum.PrintToPDF:
      //   dialogComponent = PrintPdfDialogComponent;
      //   dialogData = { recordId: this.recordId, moduleEnum: this.moduleEnum };
      //   break;

      default:
        return;
    }

    this.dialog
      .open(dialogComponent, {
        data: dialogData,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result?.actionName === 'SendEmail' && result?.isSuccess) {
          if (result?.data?.updateCitizenEmail) {
            this.emailAddress.current = result.data.emailAddress;
          }
        }

        if (result?.actionName === 'SendSms' && result?.isSuccess) {
          if (result?.data?.updateCitizenPhoneNumber) {
            this.phoneNumber.current = result.data.phoneNumber;
          }
        }
      });
  }

  closeTicketPaymentModal(): void {
    this.isTicketPaymentModalOpen.set(false);
  }

  closeNewLegalRequestModal(): void {
    this.isNewLegalRequestModalOpen.set(false);
  }

  performAction(actionBtn: string): void {
    this.action.emit(actionBtn);

    switch (actionBtn) {
      case ActionButtonsEnum.SendEmail:
        this.openDialog(ActionButtonsEnum.SendEmail);
        break;

      case ActionButtonsEnum.SendToPhone:
        this.openDialog(ActionButtonsEnum.SendToPhone);
        break;

      case ActionButtonsEnum.PrintToPDF:
        this.openDialog(ActionButtonsEnum.PrintToPDF);
        break;

      case ActionButtonsEnum.AddReminder:
        this.actionService.setNote(true);
        break;

      case ActionButtonsEnum.Payment:
        if (this.moduleEnum === ModuleEnum.ParkingPermitsModule) {
          this.handleParkingPermitPayment();
          return;
        } else if (this.moduleEnum === ModuleEnum.TicketsNewModule) {
          this.isTicketPaymentModalOpen.set(true);
        }
        break;

      case ActionButtonsEnum.Create:
        this.routerService.navigateToUrl([
          '',
          ROUTE_PATH.ParkingPermits.Create,
        ]);
        break;

      case ActionButtonsEnum.NewRequest:
        this.handleNewLegalRequest();
        break;

      default:
        return;
    }
  }

  handleNewLegalRequest(): void {
    const options = Object.entries(LegalRequestTypeMappingToString).map(
      ([id, value]) => ({ id, value })
    );
    
    this.LegalRequestTypeOptions.set(options);
    this.legalRequestModalButtons.set([]);
    this.isNewLegalRequestModalOpen.set(true);
  }

  handleParkingPermitPayment(): void {
    const { recordData, recordId, moduleEnum, _router } = this;

    let data: { records?: any[]; module: ModuleEnum; recordId?: string } = {
      records: [recordData],
      module: moduleEnum,
    };
    
    const currentUrl = _router.url;
    const parkingPermitsBasePath = `main/${this.role()}/${ParkingPermits.Home}`;

    if (currentUrl === `/${parkingPermitsBasePath}`) {
      data = {
        recordId: recordId,
        module: moduleEnum,
      };
    }

    _router
      .navigate([`main/${this.role()}/payment`], {
        state: { data },
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }

  handleModalButtonsChange(newButtons: ModalButton[]): void {
    this.modalButtons.set(newButtons);
  }

  handleAmountChange(newAmountData: TicketPaymentBalance): void {
    this.amountData = newAmountData;
  }

  handleSelectedLegalRequestTypeChange(selectedValue: string): void {
    this.legalRequestType.set(selectedValue);
  }
}