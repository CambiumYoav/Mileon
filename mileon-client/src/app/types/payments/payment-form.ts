import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ModuleEnum } from '../enum/moduleEnum';
import { Address } from '../address';
import { Patterns } from '../../validators/validationPatterns';
import { paymentSourceEnum } from '../enum/paymentSourceEnum';

export class PaymentForm {
  module: ModuleEnum;
  recordsIds: string[];
  payer: PayerForm;
  paymentOptionId: number;
  cash?: number;
  bankTransfer?: number;
  courtPayment?: number;
  payrollDeduction?: number;
  manualPostalVoucher?: number;
  checkList?: checkForm[];
  creditCardInfo?: CreditCardInfo = new CreditCardInfo();
  paymentSourceID?: paymentSourceEnum;
  selectedPaymentAmount: number;

  constructor(paymentFormFields: PaymentForm) {
    this.module = paymentFormFields.module;
    this.recordsIds = paymentFormFields.recordsIds;
    this.payer = paymentFormFields.payer;
    this.paymentOptionId = paymentFormFields.paymentOptionId;
    this.cash = paymentFormFields.cash;
    this.bankTransfer = paymentFormFields.bankTransfer;
    this.courtPayment = paymentFormFields.courtPayment;
    this.payrollDeduction = paymentFormFields.payrollDeduction;
    this.manualPostalVoucher = paymentFormFields.manualPostalVoucher;
    this.checkList = [];
    this.creditCardInfo =
      paymentFormFields.creditCardInfo ?? new CreditCardInfo();
    this.selectedPaymentAmount = paymentFormFields.selectedPaymentAmount;
  }

  static validators = {
    cash: [Validators.pattern(/^[0-9.]+$/)],
    bankTransfer: [Validators.pattern(/^[0-9.]+$/)],
    courtPayment: [Validators.pattern(/^[0-9.]+$/)],
    payrollDeduction: [Validators.pattern(/^[0-9.]+$/)],
    manualPostalVoucher: [Validators.pattern(/^[0-9.]+$/)],
  };
}

export class CreditCardInfo {
  cardId: string;
  creditCardTransactionId: string;

  constructor(fields?: CreditCardInfo) {
    this.cardId = fields?.cardId ?? '';
    this.creditCardTransactionId = fields?.creditCardTransactionId ?? '';
  }
}

export class checkForm {
  checkNumber: number;
  amount: number;
  confirmationNumber: number;
  bankCode: number;
  bankBranchNumber: number;
  bankAccountNumber: number;
  dueDate: Date;

  constructor(checkFormFields: checkForm) {
    this.checkNumber = checkFormFields.checkNumber;
    this.amount = checkFormFields.amount;
    this.confirmationNumber = checkFormFields.confirmationNumber;
    this.bankCode = checkFormFields.bankCode;
    this.bankBranchNumber = checkFormFields.bankBranchNumber;
    this.bankAccountNumber = checkFormFields.bankAccountNumber;
    this.dueDate = checkFormFields.dueDate;
  }

  static validators = {
    checkNumber: [Validators.pattern('^[0-9]*$'), Validators.required],
    confirmationNumber: [Validators.pattern('^[0-9]*$'), Validators.required],
    amount: [Validators.pattern('^[0-9]*$'), Validators.required],
    bankAccountNumber: [
      Validators.pattern('^[0-9]{1,9}$'),
      Validators.required,
    ],
    bankCode: [Validators.required],
    bankBranchNumber: [Validators.required],
    dueDate: [Validators.required],
  };
}

export const nidRequiredIfNoPassport: ValidatorFn = (
  group: AbstractControl
): ValidationErrors | null => {
  const nidCtrl = group.get('nid');
  const passportCtrl = group.get('passportID');

  if (!nidCtrl || !passportCtrl) return null;

  const passportEmpty = !passportCtrl.value?.toString().trim();
  const nidEmpty = !nidCtrl.value?.toString().trim();

  // If passport is empty, nid must be required
  if (passportEmpty && nidEmpty) {
    // merge with other nid errors if exist
    const errors = nidCtrl.errors ?? {};
    if (!errors['required']) {
      nidCtrl.setErrors({ ...errors, required: true });
    }
  } else {
    // remove ONLY our 'required' if we added it
    if (nidCtrl.errors?.['required']) {
      const { required, ...rest } = nidCtrl.errors;
      nidCtrl.setErrors(Object.keys(rest).length ? rest : null);
    }
  }

  return null; // group-level error not needed
};

export class PayerForm {
  citizenID?: string;
  firstName: string;
  lastName: string;
  nid: string;
  email: string;
  mainPhone: string;
  mainAddress: Address = new Address();

  constructor(payerFormFields: PayerForm) {
    this.firstName = payerFormFields.firstName;
    this.lastName = payerFormFields.lastName;
    this.nid = payerFormFields.nid;
    this.email = payerFormFields.email;
    this.mainPhone = payerFormFields.mainPhone;
    this.mainAddress = payerFormFields.mainAddress ?? new Address();
  }

  static validators = {
    firstName: [Validators.required],
    lastName: [Validators.required],
    nid: [Validators.pattern('^[0-9]{9,10}$'), Validators.required],
    email: [Validators.pattern(Patterns.EMAIL)],
    mainPhone: [Validators.pattern(Patterns.PHONE_NUMBER), Validators.required],
  };
}

export const addressValidation = {
  cityID: [Validators.required],
  streetID: [Validators.required],
  houseNumber: [
    Validators.pattern(Patterns.HOUSE_NUMBER_PATTERN),
    Validators.required,
  ],
  apartment: [
    Validators.pattern(Patterns.APARTMENT_PATTERN),
    Validators.required,
  ],
};
