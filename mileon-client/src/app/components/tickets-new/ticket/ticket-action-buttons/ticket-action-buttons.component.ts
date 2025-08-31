import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ConstPath } from '../../../../constants/const_path';
import { TicketService } from '../../../../services/ticket.service';
import { ModuleEnum } from '../../../../types/enum/moduleEnum';
import { SystemEnum } from '../../../../types/enum/systemEnums';
import { MyRef } from '../../../../types/myRef';
import { Ticket } from '../../../../types/ticket';
import { TicketDetails } from '../../../../types/ticketDetails';
import { ActionButtonsComponent } from '../../../shared/action-buttons/action-buttons.component';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material-module';

@Component({
  selector: 'app-ticket-action-buttons',
  templateUrl: './ticket-action-buttons.component.html',
  styleUrls: ['./ticket-action-buttons.component.scss'],
  imports: [ActionButtonsComponent, CommonModule, MaterialModule],
})
export class TicketActionButtonsComponent implements OnInit, OnChanges {
  ticketDetails!: TicketDetails;
  walletSvg: string = '';
  phoneSvg: string = '';
  smsSvg: string = '';
  printerSvg: string = '';
  arrowSvg: string = '';
  reminderSvg: string = '';
  editSvg: string = '';
  ticketID: any;
  // mainPhoneNumber: MyRef<string> = { current: '' };
  // emailAddress: MyRef<string> = { current: '' };
  mainPhoneNumber: string = '';
  emailAddress: string = '';
  moduleEnum = ModuleEnum;

  @Input() fromTable: boolean = false;
  @Input() ticketsChecked: Ticket[] = [];
  @Input() selectedTicketIdFromTable: string = '';
  @Input() errorContent: string = '';
  @Input() sumFineAmount = 0;
  @Input() showMicrophone: boolean = false;
  @Input() showPaymentsTabs: boolean = false;
  @Input() ticketTypeID?: number;
  @Input() space: boolean = true;
  @Input() isPayDisabled: boolean = false;

  @Output() pay = new EventEmitter();
  actionButtonsList = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
    'AddReminder',
  ];

  isActionDropdownOpened: boolean = false;

  activeTicketAction: string = ''; // change to enum

  systemEnum = SystemEnum;
  selectedAction = SystemEnum.FOR_TICKET;

  microphoneSvg: string = '';
  state$: Subscription | null = null;
  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  public dialog = inject(MatDialog);
  private _router = inject(Router);
  private _Activatedroute = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  constructor() {}

  ngOnInit(): void {
    this.ticketID = this._Activatedroute.parent?.snapshot.paramMap.get('id');
    if (!this.ticketID) {
      this._router.navigate(['home']);
    }
    this.initIcons();
    this.state$ = this._Activatedroute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res: any) => {
        if (res && res.data && res.data.ticketDetails) {
          this.ticketDetails = res.data.ticketDetails;
          this.buildData();
          this.checkIfTicketPayable();
        } else {
          this.getTicketDetails();
        }
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    const currentUrl = this._router.url;
    if (
      currentUrl.endsWith('/connected-tickets') ||
      currentUrl.endsWith('/payment-history') ||
      currentUrl.endsWith('/history')
    ) {
      if (changes['ticketsChecked'] && !changes['ticketsChecked'].firstChange) {
        const currentTickets = changes['ticketsChecked'].currentValue;
        this.ticketID = currentTickets[0].ticketID;
      }
      if (
        changes['selectedTicketIdFromTable'] &&
        !changes['selectedTicketIdFromTable'].firstChange
      ) {
        this.ticketID = changes['selectedTicketIdFromTable'].currentValue;
      }
    }
  }

  ngAfterViewInit() {
    this.toggleButtons(false);
  }

  initIcons() {
    this.walletSvg = ConstPath.WALLET;
    this.phoneSvg = ConstPath.PHONE;
    this.smsSvg = ConstPath.SMS;
    this.printerSvg = ConstPath.PRINTER;
    this.arrowSvg = ConstPath.ARROW_LEFT;
    this.reminderSvg = ConstPath.REMINDER;
    this.editSvg = ConstPath.EDIT;
    this.microphoneSvg = ConstPath.MICROPHONE;
  }

  getTicketDetails() {
    this.ticketService.getTicketDetails(this.ticketID).subscribe({
      next: (res) => {
        this.ticketDetails = res;
        this.checkIfTicketPayable();
        this.ticketService.afterGetTicketDetails.emit(this.ticketDetails);
        this.buildData();
      },
      error: (err) => {},
    });
  }

  setPaymentBtn(action: SystemEnum) {
    this.selectedAction = action;
  }

  checkIfTicketPayable() {
    if (
      this.ticketDetails.ticketStatusID == 1 ||
      this.ticketDetails.paymentBalance <= 0
    ) {
      this.actionButtonsComponent.toggleDisabled(['Payment'], true);
    }
  }

  buildData() {
    this.preparePhones();
    this.emailAddress = this.ticketDetails.citizen.email ?? '';
  }

  preparePhones() {
    let phones = this.ticketDetails.citizen.citizenPhones;
    let mainPhone = phones?.find((phone) => phone.isMain == true);
    let anotherPhone = phones?.find((phone) => phone.isMain == false);
    this.mainPhoneNumber = mainPhone?.phone
      ? mainPhone.phone
      : anotherPhone?.phone
      ? anotherPhone.phone
      : '';
  }

  toggleButtons(btnStatus: boolean) {
    this.actionButtonsComponent.toggleDisabled(
      this.actionButtonsList,
      btnStatus
    );
  }
}
