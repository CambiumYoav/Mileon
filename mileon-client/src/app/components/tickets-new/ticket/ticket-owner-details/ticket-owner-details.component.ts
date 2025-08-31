import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, map } from 'rxjs';
import { ConstPath } from '../../../../constants/const_path';
import { PermissionRoutes } from '../../../../constants/permissions.enum';
import { CitizenService } from '../../../../services/citizen.service';
import { PermissionService } from '../../../../services/permission.service';
import { RouterService } from '../../../../services/router.service';
import { TicketService } from '../../../../services/ticket.service';
import {
  AdvancedForm,
  FieldTypeEnum,
} from '../../../../types/advanced-search/form-tab.model';
import { CitizenPhone } from '../../../../types/citizenPhones';
import { AddressTypeEnum } from '../../../../types/enum/addressTypeEnum';
import { ModuleEnum } from '../../../../types/enum/moduleEnum';
import { TicketOwnerAddressesTabs } from '../../../../types/filters/ticket/ticketFilterOptionsNew';
import { TicketDetails } from '../../../../types/ticketDetails';
import { Patterns } from '../../../../validators/validationPatterns';
import { ActionButtonsComponent } from '../../../shared/action-buttons/action-buttons.component';
import { SelectComponent } from '../../../shared/base/select/select.component';
import { Pipes } from '../../../../shared/shared-modules';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from "../../../shared/base/button/button.component";

@Component({
  selector: 'app-ticket-owner-details',
  templateUrl: './ticket-owner-details.component.html',
  styleUrls: ['./ticket-owner-details.component.scss'],
  imports: [ButtonComponent,SelectComponent, ActionButtonsComponent, Pipes, CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent]
})
export class TicketOwnerDetailsComponent implements OnInit, AfterViewInit {
  ticketID: any;
  ticketDetails!: TicketDetails;
  phone!: CitizenPhone;
  anotherPhone!: CitizenPhone;
  addressTypeEnum = AddressTypeEnum;
  actionButtonsList = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
    'AddReminder',
  ];
  mainPhoneNumber: string = '';
  moduleEnum = ModuleEnum;
  emailAddress: string='';

  arrowSvg = ConstPath.ARROW_LEFT;
  title: string = 'בעל העבירה';

  editSvg: string = ConstPath.EDIT;

  state$: Subscription = new Subscription();
  formGroup!: FormGroup;
  formReady: boolean = false;
  isSameAddresses: boolean = false;

  addressAdvancedForm: AdvancedForm =
    TicketOwnerAddressesTabs.TicketOwnerAddressesTabs;
  FieldTypeEnum = FieldTypeEnum;
  updateTicketOwnerButton: boolean = false;

  private ticketService = inject(TicketService);
  private citizenService = inject(CitizenService);
  private _Activatedroute = inject(ActivatedRoute);
  private formBuilder = inject(FormBuilder);
  private _router = inject(Router);
  private router = inject(RouterService);
  private permissionsService = inject(PermissionService);
  constructor() {
    this.updateTicketOwnerButton = this.permissionsService.checkUserPermission(
      PermissionRoutes.UPDATE_CITIZEN_TICKET
    );
  }

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

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
          this.checkIfTicketIsPayable();
          this.buildData();
        } else {
          this.getTicketDetails();
        }
      });
  }
  initIcons() {
    this.editSvg = ConstPath.EDIT;
  }

  checkIfTicketIsPayable(): void {
    // change ticket status to enum
    if (
      this.ticketDetails.paymentBalance <= 0 ||
      this.ticketDetails.ticketStatusID == 1
    ) {
      this.actionButtonsComponent.toggleDisabled(['Payment'], true);
    }
  }

  ngAfterViewInit() {
    this.toggleButtons(false);
  }

  getTicketDetails() {
    this.ticketService.getTicketDetails(this.ticketID).subscribe({
      next: (res) => {
        this.ticketDetails = res;
        this.checkIfTicketIsPayable();
        this.ticketService.afterGetTicketDetails.emit(this.ticketDetails);
        this.buildData();
      },
      error: (err) => {},
    });
  }

  buildData() {
    this.isSameAddresses =
      this.ticketDetails.citizen.interiorMinistryHomeAddress?.addressID ==
      this.ticketDetails.citizen.homeAddress.addressID;
    this.emailAddress = this.ticketDetails.citizen.email ?? '';

    this.preparePhones();
    this.formGroup = this.formBuilder.group({
      email: this.formBuilder.control(
        this.ticketDetails && this.ticketDetails.citizen
          ? this.ticketDetails.citizen.email
          : '',
        Validators.pattern(Patterns.EMAIL)
      ),
      phone: this.formBuilder.control(
        this.phone?.phone,
        Validators.pattern(Patterns.PHONE_NUMBER)
      ),
      anotherPhone: this.formBuilder.control(
        this.anotherPhone?.phone,
        Validators.pattern(Patterns.PHONE_NUMBER)
      ),
      homeAddress: this.buildAddressGroup('homeAddress'),
      postalAddress: this.buildAddressGroup('postalAddress'),
    });
    this.formReady = true;
  }

  buildAddressGroup(groupName: string) {
    const formGroup = this.formBuilder.group({});
    let fields = this.addressAdvancedForm.tabs.find(
      (tab) => tab.name == groupName
    )?.rows[0].group;
    if (fields) {
      fields.forEach((field) => {
        formGroup.addControl(
          field.name,
          this.formBuilder.control(
            this.getFieldValue(groupName, field.name),
            Validators.pattern(field.validationPattern ?? '.*')
          )
        );
      });
    }
    return formGroup;
  }

  getFieldValue(groupName: string, fieldName: string) {
    if (fieldName.includes('Street')) {
      fieldName = 'streetID';
    }
    if (fieldName.includes('City')) {
      fieldName = 'cityID';
    }
    return (this.ticketDetails.citizen as Record<string, any>)[groupName][fieldName];
  }

  preparePhones() {
    let phones = this.citizenService.buildPhonesObjects(
      this.ticketDetails.citizen
    );
    this.phone = phones?.phone;
    this.anotherPhone = phones?.anotherPhone;
    this.mainPhoneNumber = phones?.phone?.phone
      ? phones.phone.phone
      : phones?.anotherPhone?.phone
      ? phones?.anotherPhone.phone
      : '';
  }

  handelEmptyHouseNumber() {
    let citizen = this.ticketDetails.citizen;
    if (!citizen.homeAddress.houseNumber) {
      citizen.homeAddress.houseNumber = undefined;
    }
    if (!citizen.postalAddress.houseNumber) {
      citizen.postalAddress.houseNumber = undefined;
    }
  }

  setPhones() {
    this.phone.phone = this.formGroup.get('phone')?.value;
    this.anotherPhone.phone = this.formGroup.get('anotherPhone')?.value;
  }

  updateCitizenAddresses() {
    // Because the select component must distinguish between the controls names to get the data, we call the felids
    // like : homeAddressCityID and  postalAddressCityID instead of cityID for both.
    this.ticketDetails.citizen.homeAddress.cityID = this.formGroup
      .get('homeAddress')
      ?.get('homeAddressCityID')?.value;
    this.ticketDetails.citizen.homeAddress.streetID = this.formGroup
      .get('homeAddress')
      ?.get('homeAddressStreetID')?.value;
    this.ticketDetails.citizen.postalAddress.cityID = this.formGroup
      .get('postalAddress')
      ?.get('postalAddressCityID')?.value;
    this.ticketDetails.citizen.postalAddress.streetID = this.formGroup
      .get('postalAddress')
      ?.get('postalAddressStreetID')?.value;
    this.ticketDetails.citizen.interiorMinistryHomeAddress = undefined;
    this.ticketDetails.citizen.interiorMinistryPostalAddress = undefined;
    this.handelEmptyHouseNumber();
  }

  save() {
    this.updateCitizenAddresses();
    this.handelEmptyHouseNumber();
    this.setPhones();
    this.ticketService
      .updateTicketOwner(this.ticketID, this.ticketDetails.citizen)
      .subscribe({
        next: (res) => {
          this.ticketDetails.citizen = res; // to do check address
          this.ticketService.afterGetTicketDetails.emit(this.ticketDetails);
          this.preparePhones();
          this.getTicketDetails();
        },
        error: (err) => {},
      });
  }

  back() {
    this.ticketService.navigateSideMenu.emit(1);
    // this._router.navigate(['home/dispatcher']);
    this.router.back();
  }

  toggleButtons(btnStatus: boolean) {
    this.actionButtonsComponent.toggleDisabled(
      this.actionButtonsList,
      btnStatus
    );
  }
}
