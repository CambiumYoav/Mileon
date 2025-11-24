import {
  Component,
  DestroyRef,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../constants/const_path';
import { ROUTE_PATH } from '../../constants/routerPath';
import { CitizenService } from '../../services/citizen.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';
import { Address } from '../../types/address';
import {
  DataFunction,
  FieldTypeEnum,
  Field,
} from '../../types/advanced-search/form-tab.model';
import { Citizen } from '../../types/citizen';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { ModuleEnum } from '../../types/enum/moduleEnum';
import { paymentOptionsEnum } from '../../types/enum/paymentOptionsEnum';
import { paymentSourceEnum } from '../../types/enum/paymentSourceEnum';
import { Icon } from '../../types/icon';
import { ListData } from '../../types/listData';
import { ParkingPermitDetails } from '../../types/parkingPermit/parkingPermitDetails';
import { ParkingPermitType } from '../../types/parkingPermit/parkingPermitType';
import { PayerInfoFields, fields } from '../../types/payments/payer-info';
import { Payment } from '../../types/payments/payment';
import {
  PaymentForm,
  PayerForm,
  nidRequiredIfNoPassport,
  addressValidation,
  checkForm,
  CreditCardInfo,
} from '../../types/payments/payment-form';
import { pelecardMessages } from '../../types/payments/PeleCardMessages';
import { TicketNew } from '../../types/ticket';
import { TicketIcons } from '../../types/ticket/ticket-icons.model';
import { UserActivityData } from '../../types/userActivityData';
import {
  isTicketNewArray,
  isParkingPermitType,
} from '../../utils/checkRecordsType';
import { Patterns } from '../../validators/validationPatterns';
import { ParkingPermitsService } from '../parking-permits/parking-permits.service';
import { BaseFormService } from '../shared/base-form/base-form.service';
import { PaymentService } from './payment.service';
import { InputTextComponent } from '../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../shared/base/select/select.component';
import { ButtonComponent } from '../shared/base/button/button.component';
import { SafePipe } from '../../pipes/safe.pipe';
import { CheckboxComponent } from '../shared/base/checkbox/checkbox.component';
import { IconComponent } from '../shared/base/icon/icon.component';
import { TagComponent } from '../shared/base/tag/tag.component';
import { SharedImports } from '../../shared/shared-modules';
import { ParkingPermitDetailsRowComponent } from './parking-permit-details-row/parking-permit-details-row.component';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    SharedImports,
    InputTextComponent,
    SelectComponent,
    ButtonComponent,
    CheckboxComponent,
    IconComponent,
    TagComponent,
    ParkingPermitDetailsRowComponent,
    SafePipe,
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent {
  // Inject dependencies using inject() function
  private readonly baseFormService = inject(BaseFormService);
  private readonly paymentService = inject(PaymentService);
  private readonly citizenService = inject(CitizenService);
  private readonly userService = inject(UserService);
  private readonly toaster = inject(ToastrService);
  public readonly routerService = inject(RouterService);
  private readonly parkingPermitService = inject(ParkingPermitsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  // Signals for reactive state
  recordId = signal<string>('');
  records = signal<TicketNew[] | ParkingPermitType[]>([]);
  cardId = signal<string>('');
  iframeUrl = signal<string>('');
  loading = signal<boolean>(false);
  totalPaymentBalance = signal<number>(0);
  payerInfoFound = signal<boolean>(false);
  displayChecksValidationErrors = signal<boolean>(false);
  skipFormValidation = signal<boolean>(true);
  moduleEnum = signal<ModuleEnum | undefined>(undefined);
  isLimitedAccounts = signal<boolean[]>([]);
  payer = signal<Citizen | undefined>(undefined);
  currentActivityData = signal<UserActivityData>(inject(UserActivityData));

  // Computed signals
  ticketRecords = computed(() =>
    isTicketNewArray(this.records())
      ? (this.records() as TicketNew[])
      : undefined
  );

  parkingPermitRecords = computed(() =>
    isParkingPermitType(this.records())
      ? (this.records() as ParkingPermitType[])
      : undefined
  );

  recordsIds = computed(() => {
    const module = this.moduleEnum();
    const records = this.records();

    if (module === ModuleEnum.TicketsNewModule && isTicketNewArray(records)) {
      return records.map((record) => record.ticketID);
    } else if (
      module === ModuleEnum.ParkingPermitsModule &&
      isParkingPermitType(records)
    ) {
      return records.map((record) => record.parkingPermitID);
    }
    return [];
  });

  // Constants
  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;
  readonly Icons = ConstPath;
  readonly paymentOptionsEnum = paymentOptionsEnum;
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly ModuleEnum = ModuleEnum;
  readonly ticketDetailsSvg = ConstPath.TICKET_DETAILS_FILLED;
  readonly Vector = ConstPath.Vector;
  readonly fields = fields;
  readonly payerFields: Field[] = PayerInfoFields;

  // Form-related properties
  paymentForm: FormGroup;
  paymentOptionId: FormControl;
  eventsString: string[] = [];
  handlePeleCardRef: any;
  paymentOptions: ListData<number>[] = [];
  payments: Payment[] = [];
  payerResenditialAddress?: Address;

  // Data functions
  getBanksNames: DataFunction = { name: 'getBanksNames' };
  getBankBranches: DataFunction = {
    name: 'getBankBranches',
    extraParams: [{ connectedField: 'bankCode', paramName: 'bankCodes' }],
  };

  constructor() {
    // Initialize payment form
    this.paymentForm = this.baseFormService.createFormGroup(PaymentForm);

    // Create payer form group with cross-field validation
    const payerGroup = this.baseFormService.createFormGroup(PayerForm);
    payerGroup.setValidators(nidRequiredIfNoPassport);
    this.paymentForm.setControl('payer', payerGroup);

    // Set address validation
    this.baseFormService.setValidations(
      this.paymentForm.get('payer')?.get('mainAddress') as FormGroup,
      addressValidation
    );

    // Setup payment option control
    this.paymentOptionId = this.paymentForm.get(
      'paymentOptionId'
    ) as FormControl;

    // Handle PeleCard messages
    this.handlePeleCardRef = this.handlePeleCard.bind(this);
    this.handleCallback();

    // Subscribe to user activity data with automatic cleanup
    this.userService.userActivityDataSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((activityData) => this.currentActivityData.set(activityData));

    // Watch for payment option changes
    this.paymentOptionId.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.skipFormValidation.set(false);
      });

    // Initialize component with route data
    this.initializeFromRouteData();
  }

  private initializeFromRouteData(): void {
    const navigation = this.router.getCurrentNavigation();
    const params = navigation?.extras.state?.['data'] || history.state?.data;

    if (!params) {
      this.router.navigate(['home']);
      return;
    }

    this.moduleEnum.set(params.module);
    this.recordId.set(params.recordId);

    if (this.recordId()) {
      this.fetchRecordData().then(() => this.initPayment());
    } else {
      this.records.set(params.records);
      this.paymentForm.get('module')?.setValue(params.module);
      this.initPayment();
    }
  }

  private initPayment(): void {
    this.calculateTotal();
    this.getTheOwnerDetailsIfThereIsOneOwner();
    this.getIframe();
    this.addCheck();
    this.initPaymentAmount();
  }

  private initPaymentAmount(): void {
    const total = this.totalPaymentBalance();
    this.paymentForm.patchValue({
      selectedPaymentAmount: total,
    });
    this.paymentForm
      ?.get('selectedPaymentAmount')
      ?.setValidators([
        Validators.max(total),
        Validators.pattern(Patterns.NUMBER),
      ]);
    this.paymentForm.get('selectedPaymentAmount')?.updateValueAndValidity();
  }

  async fetchRecordData(): Promise<void> {
    try {
      const id = this.recordId();
      if (id) {
        const res: ParkingPermitDetails =
          await this.parkingPermitService.getParkingPermitById(id);
        this.records.set([res]);
      }
    } catch (error) {
      console.error('Error fetching record data:', error);
      this.toaster.error(
        ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER ||
          'Error fetching data'
      );
    }
  }

  private calculateTotal(): void {
    const records = this.records();
    const module = this.moduleEnum();
    let total = 0;

    if (module === ModuleEnum.TicketsNewModule && isTicketNewArray(records)) {
      total = records.reduce((sum, record) => sum + record.paymentBalance, 0);
    } else if (
      module === ModuleEnum.ParkingPermitsModule &&
      isParkingPermitType(records)
    ) {
      total = records.reduce((sum, record) => sum + record.cost, 0);
    }

    this.totalPaymentBalance.set(total);
  }

  payPartialAmount(): void {
    if (
      this.paymentForm.get('selectedPaymentAmount')?.value !==
      this.totalPaymentBalance()
    ) {
      this.getIframe();
    }
  }

  async getIframe(): Promise<void> {
    let currentTotalPaymentBalance = this.totalPaymentBalance();
    const paymentOptionId = this.paymentForm.get('paymentOptionId')?.value;

    if (
      paymentOptionId === paymentOptionsEnum.CreditCard &&
      this.moduleEnum() === ModuleEnum.TicketsNewModule
    ) {
      currentTotalPaymentBalance = this.paymentForm.get(
        'selectedPaymentAmount'
      )?.value;
    }

    try {
      const res = await this.paymentService.getPaymentIframe(
        this.recordsIds(),
        currentTotalPaymentBalance,
        this.cardId(),
        this.moduleEnum()!
      );

      if (res?.iframeURL) {
        this.iframeUrl.set(res.iframeURL);
        const creditCardInfo = this.paymentForm.get(
          'creditCardInfo'
        ) as FormGroup;
        creditCardInfo.controls['cardId'].patchValue(res.cardID);
      }
    } catch (error) {
      console.error('Error getting iframe:', error);
    }
  }

  private handleCallback(): void {
    if (typeof window !== 'undefined') {
      window.addEventListener('message', this.handlePeleCardRef, true);

      // Cleanup on destroy
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('message', this.handlePeleCardRef, true);
      });
    }
  }

  private getTheOwnerDetailsIfThereIsOneOwner(): void {
    const records = this.records();
    const module = this.moduleEnum();
    let ownersIDs: string[] | undefined;

    if (module === ModuleEnum.TicketsNewModule && isTicketNewArray(records)) {
      ownersIDs = records
        .map((record) => record.citizenID)
        .filter((id): id is string => id !== undefined);
    } else if (
      module === ModuleEnum.ParkingPermitsModule &&
      isParkingPermitType(records)
    ) {
      ownersIDs = records
        .map((record) => record.citizen.citizenID)
        .filter((id): id is string => id !== undefined);
    }

    if (
      ownersIDs?.[0] &&
      this.checkIfAllTheRecordsBelongToOneOwner(ownersIDs)
    ) {
      this.getTheDataOfTheRecordsOwner(ownersIDs[0]);
    } else {
      this.toaster.error(ErrorSuccessMessages.USER_NOT_FOUND);
    }
  }

  private checkIfAllTheRecordsBelongToOneOwner(ids: string[]): boolean {
    const firstID = ids[0];
    return ids.every((value) => value === firstID);
  }

  async getTheDataOfTheRecordsOwner(citizenID: string): Promise<void> {
    if (citizenID) {
      const citizen = await this.citizenService.getCitizenByID(citizenID);
      this.payer.set(citizen);
      this.autoFillThePayerDetails();
      this.payerInfoFound.set(true);
    }
  }

  onCheckboxChange(event: any): void {
    if (event) {
      this.autoFillThePayerDetails();
    } else {
      this.clearThePayerDetails();
    }
  }

  private autoFillThePayerDetails(): void {
    const payerData = this.payer();
    if (!payerData) return;

    let address: any;

    for (const key of Object.keys(payerData)) {
      if (key === 'mainAddress') {
        address = (payerData as any)[key]?.address;
        continue;
      }

      this.paymentForm
        .get('payer')
        ?.get(key)
        ?.setValue((payerData as any)[key] || '');
    }

    if (address) {
      delete address.addressID;
      for (const key of Object.keys(address)) {
        this.paymentForm
          .get('payer')
          ?.get('mainAddress')
          ?.get(key)
          ?.setValue(address[key] || '');
      }
    }
  }

  private clearThePayerDetails(): void {
    this.paymentForm.get('payer')?.reset();
  }

  private handlePeleCard(event: MessageEvent): void {
    if (
      event?.source &&
      (event.source as any).location?.pathname === '/payment-success' &&
      event.data &&
      typeof event.data === 'string' &&
      !this.eventsString.includes(event.data)
    ) {
      try {
        this.eventsString.push(event.data);
        const pelecardResponse = JSON.parse(event.data);

        const creditCardInfo = this.paymentForm.get(
          'creditCardInfo'
        ) as FormGroup;
        creditCardInfo.controls['creditCardTransactionId'].patchValue(
          pelecardResponse.PelecardTransactionId
        );

        this.savePayment();
      } catch (error) {
        console.error('Error handling PeleCard response:', error);
      }
    } else if (
      (event?.source as any)?.location?.pathname === '/payment-error' &&
      event.data &&
      typeof event.data === 'string' &&
      !this.eventsString.includes(event.data)
    ) {
      this.eventsString.push(event.data);
      const data = JSON.parse(event.data);
      const EXPIRED_CODE = '301';

      if (data.PelecardStatusCode) {
        const code = data.PelecardStatusCode;
        if (EXPIRED_CODE !== code) {
          this.toaster.error(
            pelecardMessages[code as keyof typeof pelecardMessages]
          );
        }
        this.cardId.set('');
        this.getIframe();
      }
    }
  }

  async addCheck(): Promise<void> {
    const checkList = this.getCheckListFormArray();
    let isValidCheck = true;

    if (checkList.length > 0) {
      isValidCheck = await this.validateCheck(checkList);
    }

    if (isValidCheck) {
      const newCheckFormGroup = this.baseFormService.createFormGroup(checkForm);
      checkList.push(newCheckFormGroup);
      this.displayChecksValidationErrors.set(false);
    }
  }

  async validateCheck(checkList: FormArray): Promise<boolean> {
    this.displayChecksValidationErrors.set(true);
    const currentCheckFormGroup = checkList.at(checkList.length - 1);

    if (currentCheckFormGroup.invalid) {
      return false;
    }

    const checkValues = currentCheckFormGroup.value;
    const response = await this.paymentService.checkLimitedAccount([
      checkValues,
    ]);
    const currentAccounts = this.isLimitedAccounts();
    currentAccounts[checkList.length - 1] = response[0];
    this.isLimitedAccounts.set([...currentAccounts]);

    if (currentAccounts[checkList.length - 1]) {
      this.toaster.error(ErrorSuccessMessages.LIMITED_ACCOUNT);
      return false;
    }

    return true;
  }

  validateCheckInputs(index: number): boolean {
    const checkList = this.getCheckListFormArray();
    const currentCheckFormGroup = checkList.at(index);
    return currentCheckFormGroup.valid;
  }

  getCheckListFormArray(): FormArray {
    return this.paymentForm.get('checkList') as FormArray;
  }

  async payByChecks(): Promise<void> {
    this.displayChecksValidationErrors.set(true);
    const checkList = this.getCheckListFormArray();

    if (checkList.invalid) {
      return;
    }

    if (checkList?.length > 0) {
      const limitedAccounts = await this.paymentService.checkLimitedAccount(
        checkList.value
      );
      this.isLimitedAccounts.set(limitedAccounts);

      const allAccountsNotLimited = limitedAccounts.every(
        (element: any) => element === false
      );
      if (allAccountsNotLimited) {
        this.savePayment();
      }
    }
  }

  checkIfCheckFieldIsValid(i: number, controlName: string): boolean {
    return (
      this.paymentForm.get('checkList')?.get(i.toString())?.get(controlName)
        ?.valid ?? false
    );
  }

  async savePayment(): Promise<void> {
    this.skipFormValidation.set(false);
    this.clearNotSelectedPaymentMethodFields();

    const saveRequest: PaymentForm = this.paymentForm.value;

    if (paymentOptionsEnum.CreditCard !== saveRequest.paymentOptionId) {
      saveRequest.creditCardInfo = undefined;
    }

    const payedAmount = this.calculatePaymentAmount();

    if (payedAmount > this.totalPaymentBalance()) {
      const checkList = saveRequest.checkList;
      if (checkList?.length === 0) {
        this.addCheck();
      }
      this.toaster.error(
        ErrorSuccessMessages.EXCEEDED_PAYMENT_LIMIT_ERROR_MESSAGE
      );
      return;
    }

    saveRequest.recordsIds = this.recordsIds();
    saveRequest.paymentSourceID = paymentSourceEnum.ManagementSystem;
    saveRequest.module = this.moduleEnum()!;

    if (this.paymentForm.valid) {
      this.loading.set(true);
      try {
        const res = await this.paymentService.savePayments(saveRequest);
        this.loading.set(false);

        if (res.length) {
          const activityData = this.currentActivityData();
          activityData.userPaymentCount++;
          this.currentActivityData.set(activityData);
          this.userService.userActivityDataSubject.next(activityData);
          this.updateRecordsAfterPaying(res, saveRequest.paymentOptionId);
        }

        if (!this.totalPaymentBalance()) {
          this.routerService.back();
        }
      } catch (error) {
        this.loading.set(false);
        console.error('Error saving payment:', error);
      }
    }

    this.clearPaymentMethodsFields();
  }

  private updateRecordsAfterPaying(
    result: TicketNew[] | ParkingPermitType[],
    paymentMethod: paymentOptionsEnum
  ): void {
    if (this.moduleEnum() === ModuleEnum.ParkingPermitsModule) {
      const baseRoute = ROUTE_PATH.ParkingPermits.Home;
      this.routerService.navigateToPageURL(`${baseRoute}`);
    }

    this.records.set(result);
    this.removePayedRecords();
    this.calculateTotal();
    this.initPaymentAmount();

    if (this.totalPaymentBalance() === 0) {
      if (this.moduleEnum() === ModuleEnum.ParkingPermitsModule) {
        const baseRoute = ROUTE_PATH.ParkingPermits.Home;
        this.routerService.navigateToPageURL(`${baseRoute}`);
      } else {
        this.routerService.back();
      }

      if (paymentMethod === paymentOptionsEnum.CreditCard) {
        this.routerService.back();
      }
    }
  }

  private removePayedRecords(): void {
    const records = this.records();

    if (
      this.moduleEnum() === ModuleEnum.TicketsNewModule &&
      isTicketNewArray(records)
    ) {
      this.records.set(records.filter((record) => record.paymentBalance !== 0));
    }
  }

  private clearNotSelectedPaymentMethodFields(): void {
    const paymentOption: paymentOptionsEnum =
      this.paymentForm.get('paymentOptionId')?.value;

    if (paymentOption !== paymentOptionsEnum.Cash) {
      this.clearCash();
    }
    if (paymentOption !== paymentOptionsEnum.Check) {
      this.clearChecksData();
    }
    if (paymentOption !== paymentOptionsEnum.Other) {
      this.clearOtherOptions();
    }
    if (paymentOption !== paymentOptionsEnum.CreditCard) {
      this.clearCreditCardInfo();
    }
  }

  private clearPaymentMethodsFields(): void {
    this.clearCash();
    this.clearOtherOptions();
    this.clearCreditCardInfo();
    this.clearChecksData();
    this.addCheck();
    this.clearPaymentOption();
  }

  private clearCreditCardInfo(): void {
    this.paymentForm.get('creditCardInfo')?.reset(new CreditCardInfo());
  }

  private clearCash(): void {
    this.paymentForm.get('cash')?.reset(null);
  }

  private clearChecksData(): void {
    const checkList = this.getCheckListFormArray();
    checkList.clear();
  }

  private clearPaymentOption(): void {
    this.paymentForm.get('paymentOptionId')?.reset(null);
  }

  private clearOtherOptions(): void {
    const otherControlNames = [
      'bankTransfer',
      'courtPayment',
      'payrollDeduction',
      'manualPostalVoucher',
    ];
    otherControlNames.forEach((control) =>
      this.paymentForm.get(control)?.reset(null)
    );
  }

  private calculatePaymentAmount(): number {
    const controlNames = [
      'cash',
      'bankTransfer',
      'courtPayment',
      'payrollDeduction',
      'manualPostalVoucher',
    ];

    const checkList = this.getCheckListFormArray();

    let sum = controlNames.reduce(
      (total, control) =>
        total + (parseFloat(this.paymentForm.get(control)?.value) || 0),
      0
    );

    for (let i = 0; i < checkList.length; i++) {
      const checkFormGroup = checkList.at(i) as FormGroup;
      const amountControl = checkFormGroup.get('amount');
      if (amountControl) {
        sum += parseFloat(amountControl.value ?? 0);
      }
    }

    return sum;
  }

  copyCheckDetails(checkIndex: number, event: any): void {
    const target = event.target as HTMLInputElement;
    const checkList = this.getCheckListFormArray();
    const previousCheckFormGroup = checkList.at(checkIndex - 1);
    const currentCheckFormGroup = checkList.at(checkIndex);

    const controlNames = [
      'bankCode',
      'bankBranchNumber',
      'bankAccountNumber',
      'amount',
    ];

    if (previousCheckFormGroup && target.checked) {
      controlNames.forEach((controlName) => {
        currentCheckFormGroup
          .get(controlName)
          ?.setValue(previousCheckFormGroup.get(controlName)?.value);
      });
    } else if (!target.checked) {
      controlNames.forEach((controlName) => {
        currentCheckFormGroup.get(controlName)?.patchValue(null);
      });
    }
  }

  removeRecord(recordId: string): void {
    const records = this.records();

    if (
      this.moduleEnum() === ModuleEnum.TicketsNewModule &&
      isTicketNewArray(records)
    ) {
      const recordsIds = this.recordsIds();
      const index = recordsIds.indexOf(recordId);

      if (index !== -1) {
        const newRecords = [...records];
        this.totalPaymentBalance.update(
          (balance) => balance - newRecords[index].paymentBalance
        );
        newRecords.splice(index, 1);
        this.records.set(newRecords);
        this.getIframe();
      }
    }
  }

  getTicketStageIconById(id: number): Icon | undefined {
    return this.TicketStagesIcons.find((icon) => icon.id === id);
  }

  isTicketNewArray(): boolean {
    return isTicketNewArray(this.records());
  }

  isParkingPermitArrayType(): boolean {
    return isParkingPermitType(this.records());
  }

  // Expose utility functions for template
  protected readonly isParkingPermitTypeUtil = isParkingPermitType;
}
