import { routerConfig } from './../../../../config/routerConfig';
import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  inject,
  NgModule,
} from '@angular/core';
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Subscription } from 'rxjs';
import { ConstPath } from '../../../../constants/const_path';
import { ConstText } from '../../../../constants/const_text';
import { PermissionRoutes } from '../../../../constants/permissions.enum';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { BaseService } from '../../../../services/base.service';
import { CitizenService } from '../../../../services/citizen.service';
import { PermissionService } from '../../../../services/permission.service';
import { RouterService } from '../../../../services/router.service';
import { TicketService } from '../../../../services/ticket.service';
import { CallSummary } from '../../../../types/callSummary';
import { CitizenPhone } from '../../../../types/citizenPhones';
import { AddressTypeEnum } from '../../../../types/enum/addressTypeEnum';
import { ModuleEnum } from '../../../../types/enum/moduleEnum';
import { FileTypeEnum } from '../../../../types/enum/ticketEnums';
import { MyRef } from '../../../../types/myRef';
import { TicketDetails } from '../../../../types/ticketDetails';
import { Patterns } from '../../../../validators/validationPatterns';
import { ActionButtonsComponent } from '../../../shared/action-buttons/action-buttons.component';
import { Pipes } from '../../../../shared/shared-modules';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../../../shared/material-module';
import { CallSummaryComponent } from '../../../shared/call-summary/call-summary.component';
import { MediaGalleryComponent } from '../../../shared/base/media-gallery/media-gallery.component';
import { ButtonComponent } from '../../../shared/base/button/button.component';

@Component({
  selector: 'app-ticket-details',
  templateUrl: './ticket-details.component.html',
  styleUrls: ['./ticket-details.component.scss'],
  imports: [
    Pipes,
    CommonModule,
    ButtonComponent,
    ActionButtonsComponent,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    CallSummaryComponent,
    MediaGalleryComponent,
  ],
})
export class TicketDetailsComponent implements OnInit, AfterViewInit {
  ticketDetails!: TicketDetails;
  phone!: CitizenPhone;
  anotherPhone!: CitizenPhone;
  @Output() goToTicketOwner = new EventEmitter<number>();

  private _Activatedroute = inject(ActivatedRoute);
  private ticketService = inject(TicketService);
  private citizenService = inject(CitizenService);
  private _router = inject(Router);
  private _routerService = inject(RouterService);
  private baseService = inject(BaseService);
  private formBuilder = inject(FormBuilder);
  private permissionsService = inject(PermissionService);
  constructor() {
    this.updateTicketOwnerButton = this.permissionsService.checkUserPermission(
      PermissionRoutes.UPDATE_CITIZEN_TICKET
    );
  }
  state$: Subscription = new Subscription(); // Use Subscription type for better clarity
  ticketID = '';
  @Input() ticketIDFromExternalModule: string | null = null;
  walletSvg: string = '';
  phoneSvg: string = '';
  smsSvg: string = '';
  printerSvg: string = '';
  arrowSvg: string = '';
  reminderSvg: string = '';
  editSvg: string = '';
  days: string[] = [];
  baseImagePath: string = '';
  summarySvg: string = '';
  eyeSvg: string = '';
  isOpenCallSummary: boolean = false;
  isList: boolean = false;
  callSummariesList!: CallSummary[];
  isOpenAddNote: boolean = false;
  addressTypeEnum = AddressTypeEnum;
  formGroup!: FormGroup;
  title = '';
  backToConnectedTickets: string = '';
  backToInspectors: string = '';
  currentFile?: File;
  fileTypeEnum = FileTypeEnum;
  moduleEnum = ModuleEnum;
  mainPhoneNumber: string = '';
  emailAddress: string = '';
  // mainPhoneNumber: MyRef<string> = { current: '' };
  // emailAddress: MyRef<string> = { current: '' };
  homeAddressString: string | undefined;
  postalAddressString: string | undefined;
  inspectorUrl: string = '';
  role: string | null = '';
  updateTicketOwnerButton: boolean = false;

  Icons = ConstPath;
  actionButtonsList = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
    'AddReminder',
  ];

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  formReady: boolean = false;
  ngOnInit(): void {
    this.days = ConstText.days;
    this.baseImagePath = this.baseService.mediaUrl;
    this.role = this.permissionsService.role();
    this.initIcons();
    const url = this._routerService.getCurrentUrl();
    if (url.split('/').includes(ROUTE_PATH.LegalRequests.LegalRequest)) {
      this.ticketID = this.ticketIDFromExternalModule!;
    } else {
      this.ticketID = this._Activatedroute.parent?.snapshot.paramMap.get('id')!;
    }

    if (!this.ticketID) {
      this._router.navigate(['home']);
    }

    this.state$ = this._Activatedroute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res: any) => {
        if (res?.state?.from) {
          console.log(res?.state?.from);

          this.inspectorUrl = res.state.from;
          this.backToInspectors =
            this.extractInspectorParentPath(res.state.from) ?? '';
        }
        if (res.data) {
          this.backToConnectedTickets = res.data.from;
        }
      });

    this.state$ = this._Activatedroute.paramMap
      .pipe(map(() => window.history.state))
      .subscribe((res: any) => {
        console.log(res);
        if (res && res.data && res.data.ticketDetails) {
          this.ticketDetails = res.data.ticketDetails;
          this.buildData();
        } else {
          this.getTicketDetails();
        }
      });
    this.getCallSummuries();
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
    this.summarySvg = ConstPath.SUMMARY;
    this.eyeSvg = ConstPath.EYE;
  }

  getTicketDetails() {
    this.ticketService.getTicketDetails(this.ticketID).subscribe({
      next: (res) => {
        this.ticketDetails = res;
        this.ticketService.afterGetTicketDetails.emit(this.ticketDetails);
        this.buildData();
        this.checkIfTicketIsPayable(res);
      },
      error: (err) => {},
    });
  }

  checkIfTicketIsPayable(ticket: TicketDetails): void {
    let paymentBalance: number = ticket.paymentBalance;
    let ticketStatus = ticket.ticketStatusID;
    // change ticket status to enum
    if (paymentBalance <= 0 || ticketStatus == 1) {
      this.actionButtonsComponent.toggleDisabled(['Payment'], true);
    }
  }

  buildData() {
    this.ticketDetails.ticketGivingDate = new Date(
      this.ticketDetails.ticketGivingDate
    );
    this.preparePhones();
    this.formGroup = this.formBuilder.group({
      email: this.formBuilder.control(
        this.ticketDetails.citizen.email,
        Validators.pattern(Patterns.EMAIL)
      ),
      phone: this.formBuilder.control(
        this.phone.phone,
        Validators.pattern(Patterns.PHONE_NUMBER)
      ),
      anotherPhone: this.formBuilder.control(
        this.anotherPhone.phone,
        Validators.pattern(Patterns.PHONE_NUMBER)
      ),
    });
    this.formReady = true;
    this.emailAddress = this.ticketDetails.citizen.email ?? '';
    this.homeAddressString =
      this.ticketDetails?.citizen?.homeAddress?.fullAddress;
    this.postalAddressString =
      this.ticketDetails?.citizen?.postalAddress?.fullAddress;
  }

  preparePhones() {
    let phones = this.citizenService.buildPhonesObjects(
      this.ticketDetails.citizen
    );
    this.phone = phones?.phone;
    this.anotherPhone = phones?.anotherPhone;
    this.mainPhoneNumber = phones?.phone.phone
      ? phones.phone.phone
      : phones?.anotherPhone.phone
      ? phones?.anotherPhone.phone
      : '';
  }

  openCallSummary() {
    this.isOpenCallSummary = true;
  }

  save() {
    this.ticketService
      .updateTicketOwner(this.ticketID, this.ticketDetails.citizen)
      .subscribe({
        next: (res) => {
          this.ticketDetails.citizen = res; //to do!!!!!!!!!! return the ticket with the update from the server
          this.ticketService.afterGetTicketDetails.emit(this.ticketDetails);
          //this.ticketDetails = res;???? and else
          this.preparePhones();
        },
        error: (err) => {},
      });
  }

  getCallSummuries() {
    this.ticketService.getCallSummaries(this.ticketID).subscribe({
      next: (res) => {
        this.callSummariesList = res;
      },
    });
  }

  addCallSummary(callSummary: CallSummary) {
    this.callSummariesList.unshift(callSummary);
  }

  back() {
    if (this.backToConnectedTickets) {
      this._router.navigate(
        [`main/${this.role}/ticket/${this.ticketID}/connect`],
        {
          state: {
            data: { to: this.backToConnectedTickets },
          },
        }
      );
    } else if (this.backToInspectors) {
      this._router.navigate([`main/${this.role}/tickets-new`]);
    } else {
      this._router.navigateByUrl(this.inspectorUrl);
    }
  }

  goToPaymentDetailsPage(): void {
    let numberOfPaymentHistoryPage = 3;
    this.ticketService.setTabNumber(numberOfPaymentHistoryPage);

    const ownerRoute = `/main/${this.role}/tickets-new/ticket/${this.ticketID}/payment-history`;
    this._router.navigate([ownerRoute]);
  }

  async moreDetails(route: any) {
    // this is for the hove style in the navigation menu
    let numberOfPage = route == ROUTE_PATH.TicketsNew.Violation ? 2 : 1;
    this.ticketService.setTabNumber(numberOfPage);
    await this._routerService.navigateToPageURL(
      [
        ROUTE_PATH.TicketsNew.Home,
        ROUTE_PATH.TicketsNew.Ticket,
        this.ticketID,
        route,
      ].join('/')
    );
  }

  toggleButtons(btnStatus: boolean) {
    this.actionButtonsComponent.toggleDisabled(
      this.actionButtonsList,
      btnStatus
    );
  }

  goToTicketOwnerPage(): void {
    let numberOfTicketOwnerPage = 1;
    this.ticketService.setTabNumber(numberOfTicketOwnerPage);
    const ownerRoute = `/main/${this.role}/tickets-new/ticket/${this.ticketID}/owner`;
    this._router.navigate([ownerRoute]);
  }

  private extractInspectorParentPath(fullUrl: string): string | null {
    const pattern = new RegExp(
      `(\\/main\\/${this.role}\\/terminal\\/inspectors)(\\/[^\\/]+)?$`
    );
    console.log(fullUrl);
    const match = fullUrl.match(pattern);
    return match ? match[1] : null;
  }
}
