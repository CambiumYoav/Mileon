import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ActionAttributes } from '../../../constants/action_buttons';
import { ConstPath } from '../../../constants/const_path';
import { LegalRequestTypeMappingToString } from '../../../constants/legal-request-type-mapping';
import { PermissionRoutes } from '../../../constants/permissions.enum';
import { ROUTE_PATH } from '../../../constants/routerPath';
import { ActionService } from '../../../services/action.service';
import { PermissionService } from '../../../services/permission.service';
import { RouterService } from '../../../services/router.service';
import { ModuleEnum } from '../../../types/enum/moduleEnum';
import { MyRef } from '../../../types/myRef';
import { TicketPaymentBalance } from '../../../types/payments/payment';
import {
  Buttons as ActionButtonsEnum,
  Buttons,
} from '../../../constants/buttonEnum';
import ParkingPermits = ROUTE_PATH.ParkingPermits;
import { ButtonComponent } from '../base/button/button.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-action-buttons',
  imports: [ButtonComponent,CommonModule],
  templateUrl: './action-buttons.component.html',
  styleUrls: ['./action-buttons.component.scss'],
})
export class ActionButtonsComponent implements OnInit, OnChanges {
  icons = ConstPath;

  allowedButtons: ActionAttributes[] = [];

  @Output() action = new EventEmitter<string>();

  isTicketPaymentModalOpen: boolean = false;

  isNewLegalRequestModalOpen: boolean = false;


  legalRequestType: string = '';

  @Output() amountData: TicketPaymentBalance | any = null;

  @Input()
  errorContent: string = '';

  @Input()
  buttonsList: string[] = [];

  @Input()
  recordId: string = '';

  @Input()
  recordData: any;

  // @Input()
  // phoneNumber: MyRef<string> = { current: '' };
  @Input()
  phoneNumber: string = '';
  @Input()
  moduleEnum!: ModuleEnum;

  // @Input()
  // emailAddress: MyRef<string> = { current: '' };
  @Input()
  emailAddress: string = '';

  LegalRequestTypeOptions: { id: string; value: string }[] = [];

  activeTicketAction: string = ''; // change to enum

  ModuleEnum = ModuleEnum;

  microphoneSvg: string = '';

  role: string | null = '';
  constructor(
    private actionService: ActionService,
    public dialog: MatDialog,
    private _router: Router,
    private routerService: RouterService,
    private permissionsService: PermissionService
  ) {}

  ActionButtonsEnum = ActionButtonsEnum;

  ngOnInit(): void {
    this.initButtons();
    this.role = this.permissionsService.role();
    // this.setPaymentBtn();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recordId'] && !changes['recordId'].firstChange) {
      this.recordId = changes['recordId'].currentValue;
    }
  }

  initButtons() {
    this.buttonsList.forEach((btn) => {
      this.allowedButtons.push(
        this.actionService.buttons[
          btn as keyof typeof this.actionService.buttons
        ]
      );
    });
  }

  toggleDisabled(buttonKeys: string[], btnStatus: boolean = false) {
    const btns = this.actionService.buttons;
    for (const key in btns) {
      if (buttonKeys.includes(key)) {
        const btnKey = key as keyof typeof btns;
        btns[btnKey].disabled = btnStatus;

        switch (btns[key as keyof typeof btns].text) {
          // handle button disabled based on user permissions

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
            btns[key as keyof typeof btns].disabled =
              !this.permissionsService.checkUserPermission(
                PermissionRoutes.ACTION_SMS
              );
            break;

          default:
            break;
        }
      }
    }
  }

  initIcons() {
    this.microphoneSvg = ConstPath.MICROPHONE;
  }

  openDialog(action: ActionButtonsEnum): void {
    let dialogComponent;
    let dialogData;
    // TODO NEED TO ADD THIS COMPONNENTS
    // switch (action) {
    //   case ActionButtonsEnum.SendEmail:
    //     dialogComponent = SendEmailDialogComponent;
    //     dialogData = {
    //       recordId: this.recordId,
    //       moduleEnum: this.moduleEnum,
    //       emailAddress: this.emailAddress.current,
    //     };
    //     break;

    //   case ActionButtonsEnum.SendToPhone:
    //     dialogComponent = SendSmsDialogComponent;
    //     dialogData = {
    //       recordId: this.recordId,
    //       moduleEnum: this.moduleEnum,
    //       phoneNumber: this.phoneNumber.current,
    //       updateCitizenPhoneNumber: false,
    //     };
    //     break;

    //   case ActionButtonsEnum.PrintToPDF:
    //     dialogComponent = PrintPdfDialogComponent;
    //     dialogData = { recordId: this.recordId, moduleEnum: this.moduleEnum };
    //     break;
    //   default:
    //     return;
    // }

    // this.dialog
    //   .open(dialogComponent, {
    //     data: dialogData,
    //   })
    //   .afterClosed()
    //   .subscribe((result) => {
    //     if (result?.actionName === 'SendEmail' && result?.isSuccess) {
    //       if (result?.data?.updateCitizenEmail)
    //         this.emailAddress.current = result.data.emailAddress;
    //     }

    //     if (result?.actionName === 'SendSms' && result?.isSuccess) {
    //       if (result?.data?.updateCitizenPhoneNumber)
    //         this.phoneNumber.current = result.data.phoneNumber;
    //     }
    // });
  }

  closeTicketPaymentModal() {
    this.isTicketPaymentModalOpen = false;
  }

  closeNewLegalRequestModal() {
    this.isNewLegalRequestModalOpen = false;
  }

  performAction(actionBtn: string) {
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
          this.isTicketPaymentModalOpen = true;
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

  handleNewLegalRequest() {
    this.LegalRequestTypeOptions = Object.entries(
      LegalRequestTypeMappingToString
    ).map(([id, value]) => {
      return { id, value };
    });
    this.isNewLegalRequestModalOpen = true;
  }

  handleParkingPermitPayment() {
    const { recordData, recordId, moduleEnum, _router } = this;

    let data: { records?: any[]; module: ModuleEnum; recordId?: string } = {
      records: [recordData],
      module: moduleEnum,
    };
    const currentUrl = _router.url;
    const parkingPermitsBasePath = `main/${this.role}/${ParkingPermits.Home}`;

    if (currentUrl === `/${parkingPermitsBasePath}`) {
      data = {
        recordId: recordId,
        module: moduleEnum,
      };
    }

    _router
      .navigate([`main/${this.role}/payment`], {
        state: { data },
      })
      .catch((error) => {
        console.error('Navigation error:', error);
      });
  }


  handleAmountChange(newAmountData: TicketPaymentBalance) {
    this.amountData = newAmountData;
  }

  handleSelectedLegalRequestTypeChange(selectedValue: string) {
    this.legalRequestType = selectedValue;
  }
}
