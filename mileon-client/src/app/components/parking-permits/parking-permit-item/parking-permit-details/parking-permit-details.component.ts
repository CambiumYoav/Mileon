import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActionButtonsComponent } from '../../../shared/action-buttons/action-buttons.component';
import { ParkingPermitInfoComponent } from '../parking-permit-info/parking-permit-info.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionButtonNames } from '../../../../constants/action_buttons';
import { AuthorityService } from '../../../../services/authority.service ';
import { ParkingPermitService } from '../../../../services/parking-permit.service';
import { Address } from '../../../../types/address';
import { CitizenPhone } from '../../../../types/citizenPhones';
import { ModuleEnum } from '../../../../types/enum/moduleEnum';
import { PageTypeEnum } from '../../../../types/enum/pageTypesEnum';
import { ParkingPermitStatusEnum } from '../../../../types/enum/parkingPermitStatusEnums';
import { PermitByEnum } from '../../../../types/enum/permitByEnum';
import { ControlOptionsDictionary } from '../../../../types/formControlOptions';
import { MyRef } from '../../../../types/myRef';
import { ParkingPermitDetailsForm } from '../../../../types/parkingPermit/parking-permit-form';
import { ParkingPermitTabs } from '../../../../types/parkingPermit/parking-permit-tabs.model';
import { ParkingPermitDetails } from '../../../../types/parkingPermit/parkingPermitDetails';
import { ParkingPermitType } from '../../../../types/parkingPermit/parkingPermitType';
import { TimeLimitClass } from '../../../../types/parkingPermit/timeLimit';
import { getParkingPermitStatus } from '../../../../utils/checkParkingPermitStatus';
import { Patterns } from '../../../../validators/validationPatterns';
import { BaseFormService } from '../../../shared/base-form/base-form.service';
import { SecondaryHeaderComponent } from '../../../shared/secondary-header/secondary-header.component';

@Component({
  selector: 'app-parking-permit-details',
  imports: [
    ActionButtonsComponent,
    ParkingPermitInfoComponent,
    SecondaryHeaderComponent,
  ],
  templateUrl: './parking-permit-details.component.html',
  styleUrl: './parking-permit-details.component.scss',
})
export class ParkingPermitDetailsComponent implements OnInit, AfterViewInit {
  // ---------------------------------------------------------------------------
  // state
  // ---------------------------------------------------------------------------
  parkingPermit!: ParkingPermitDetails;
  formGroup!: FormGroup;

  permitByEnum = PermitByEnum;
  moduleEnum = ModuleEnum;

  emailAddress: MyRef<string> = { current: '' };
  phone!: CitizenPhone;
  anotherPhone!: CitizenPhone;
  phoneNumber: MyRef<string> = { current: '' };

  parkingPermitForm!: FormGroup;
  PageType!: PageTypeEnum;

  parkingPermitStatus = ParkingPermitTabs.parkingPermitStatusFields;
  isFormReady = signal<boolean>(false);
  isEditingPage!: boolean;

  actionButtonsList: ActionButtonNames[] = [
    'Payment',
    'SendToPhone',
    'SendEmail',
    'PrintToPDF',
  ];

  currentAuthority: string | null = null;

  @ViewChild('actionButtonsComponent', { static: false })
  actionButtonsComponent!: ActionButtonsComponent;

  // ---------------------------------------------------------------------------
  // DI with inject()
  // ---------------------------------------------------------------------------
  private readonly parkingPermitService = inject(ParkingPermitService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly formService = inject(BaseFormService);
  private readonly router = inject(Router);
  private readonly authorityService = inject(AuthorityService);
  private readonly destroyRef = inject(DestroyRef);

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------
  ngOnInit(): void {
    this.initParkingPermit();
    this.determinePageType();

    this.authorityService.authorityId$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((authorityID) => {
        this.currentAuthority = authorityID;
      });
  }

  ngAfterViewInit(): void {
    this.toggleButtons(false);
    this.cdr.detectChanges();
  }

  // ---------------------------------------------------------------------------
  // Page type / UI
  // ---------------------------------------------------------------------------
  determinePageType(): void {
    const currentUrl = this.router.url;
    this.isEditingPage = !currentUrl.includes('dispatcher');

    this.PageType = this.isEditingPage
      ? PageTypeEnum.TO_EDIT
      : PageTypeEnum.TO_VIEW;
  }

  checkIfParkingPermitIsPayable(parkingPermit: ParkingPermitType): void {
    const { cost, parkingPermitStatus } = getParkingPermitStatus(parkingPermit);

    if (
      cost <= 0 ||
      parkingPermitStatus !== ParkingPermitStatusEnum.AwaitingPayment
    ) {
      this.actionButtonsComponent?.toggleDisabled(['Payment'], true);
    }
  }

  toggleButtons(btnStatus: boolean): void {
    this.actionButtonsComponent.toggleDisabled(
      this.actionButtonsList,
      btnStatus
    );
  }

  // ---------------------------------------------------------------------------
  // Data init
  // ---------------------------------------------------------------------------
  initParkingPermit(): void {
    const id = this.route.parent?.snapshot.params['id'];

    if (!id) return;

    this.parkingPermitService.getParkingPermitById(id).subscribe({
      next: (res) => {
        this.parkingPermit = res;
        this.buildForm();
        this.checkIfParkingPermitIsPayable(this.parkingPermit);
      },
    });
  }

  // ---------------------------------------------------------------------------
  // Form building
  // ---------------------------------------------------------------------------
  buildForm(): void {
    console.log('building form');

    const citizenControlOptions: ControlOptionsDictionary = {
      email: {
        disabled: false,
        validation: Validators.pattern(Patterns.EMAIL),
      },
      nid: { disabled: true },
      passportID: { disabled: true },
      permitBy: { disabled: true },
      startDate: { disabled: true },
      expirationDate: { disabled: true },
    };

    this.parkingPermitForm = this.formService.createFormGroup(
      ParkingPermitDetailsForm,
      citizenControlOptions,
      !this.isEditingPage
    );

    console.log(this.parkingPermitForm);

    this.parkingPermitForm.get('citizen')?.get('email')?.enable();

    const addressControlOptions: ControlOptionsDictionary = {
      mailbox: {
        validation: Validators.pattern(Patterns.MAILBOX_PATTERN),
      },
      cityID: { disabled: true },
      streetID: { disabled: true },
      cityName: { disabled: true },
      streetName: { disabled: true },
      houseNumber: { disabled: true },
      entrance: { disabled: true },
      apartment: { disabled: true },
      postalCode: { disabled: true },
    };

    (this.parkingPermitForm.get('citizen') as FormGroup).setControl(
      'homeAddress',
      this.formService.createFormGroup(Address, addressControlOptions)
    );

    (this.parkingPermitForm.get('citizen') as FormGroup).setControl(
      'citizenPhones',
      this.formBuilder.array([
        this.formBuilder.group({
          phone: [
            '',
            [Validators.required, Validators.pattern(Patterns.PHONE_NUMBER)],
          ],
          isMain: [true],
        }),
        this.formBuilder.group({
          phone: ['', [Validators.pattern(Patterns.PHONE_NUMBER)]],
          isMain: [false],
        }),
      ])
    );

    this.parkingPermitForm
      .get('citizen.firstName')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^(?:[a-zA-Z\s]+|[\u0590-\u05FF\s]+)$/),
        Validators.maxLength(20),
      ]);
    this.parkingPermitForm.get('citizen.firstName')?.updateValueAndValidity();

    this.parkingPermitForm
      .get('citizen.lastName')
      ?.setValidators([
        Validators.required,
        Validators.pattern(/^(?:[a-zA-Z\s]+|[\u0590-\u05FF\s]+)$/),
        Validators.maxLength(20),
      ]);
    this.parkingPermitForm.get('citizen.lastName')?.updateValueAndValidity();

    this.parkingPermitForm
      .get('vehicle.vehicleNumber')
      ?.setValidators([
        Validators.required,
        Validators.pattern(Patterns.NUMBER),
        Validators.minLength(5),
        Validators.maxLength(10),
      ]);
    this.parkingPermitForm
      .get('vehicle.vehicleNumber')
      ?.updateValueAndValidity();

    this.parkingPermitForm.get('statusName')?.disable();
    this.parkingPermitForm.get('permitTypeName')?.disable();

    const timeLimitsFA = this.parkingPermitForm.get('timeLimits') as FormArray;

    const numOfDaysInWeek = 7;
    for (let i = 1; i <= numOfDaysInWeek; i++) {
      const timeLimitGroup = this.formService.createFormGroup(
        TimeLimitClass,
        undefined,
        !this.isEditingPage
      );
      timeLimitGroup.get('day')?.setValue(i);
      timeLimitsFA.push(timeLimitGroup);
    }

    this.formService.setObjectValuesToForm(
      this.parkingPermit,
      this.parkingPermitForm
    );

    this.isFormReady.set(true);
    console.log(this.parkingPermitForm);
  }

}
