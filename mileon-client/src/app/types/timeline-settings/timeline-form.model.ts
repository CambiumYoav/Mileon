import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicField } from '../infrastructure/InfrastructureTypes';

// חיי דוחות - הודעה מוקדמת
const ParkingAdvanceNoticeDaysForPayment: DynamicField = {
  name: 'AdvanceNoticeDaysForPayment',
  type: 'text',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};
const GeneralAdvanceNoticeDaysForPayment: DynamicField = {
  name: 'AdvanceNoticeDaysForPayment',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};
const AdministrativeAdvanceNoticeDaysForPayment: DynamicField = {
  name: 'AdvanceNoticeDaysForPayment',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};
// חיי דוחות - הודעה מוקדמת
export const EarlyNoticeForm = {
  Parking: [ParkingAdvanceNoticeDaysForPayment],
  General: [GeneralAdvanceNoticeDaysForPayment],
  Administrative: [AdministrativeAdvanceNoticeDaysForPayment],
};

// דוח חלון

const ParkingDaysToPerformDetailDressing: DynamicField = {
  name: 'DaysToPerformDetailDressing',
  type: 'number',
  label: 'זמן בימים לביצוע הלבשת פרטים',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};
// דוח חלון
export const TicketWindowForm = {
  Parking: [ParkingDaysToPerformDetailDressing],
  General: [],
  Administrative: [],
};

// הודעת דרישה
const DemandNoticeDaysForPayment: DynamicField = {
  name: 'DemandNoticeDaysForPayment',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};

export const OrderMessageForm = {
  Parking: [DemandNoticeDaysForPayment],
  General: [DemandNoticeDaysForPayment],
  Administrative: [DemandNoticeDaysForPayment],
};

// טופס 3
const Form3DaysForPayment: DynamicField = {
  name: 'Form3DaysForPayment',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};

export const FormThreeForm = {
  Parking: [Form3DaysForPayment],
  General: [Form3DaysForPayment],
  Administrative: [Form3DaysForPayment],
};

// תזכורת חוב
const DebtReminderDaysForPayment: DynamicField = {
  name: 'DebtReminderDaysForPayment',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
  placeholder: 'מספר',
};

export const DebtReminderForm = {
  Parking: [DebtReminderDaysForPayment],
  General: [DebtReminderDaysForPayment],
  Administrative: [DebtReminderDaysForPayment],
};

// עיקול בנק

const BankNumbersFirstPhase: DynamicField = {
  name: 'BankNumbersForFirstPhase',
  type: 'number',
  label: 'מספרי בנקים לפעימה ראשונה',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
};
const BankNumbersSecondPhase: DynamicField = {
  name: 'BankNumbersForSecondPhase',
  type: 'number',
  label: 'מספרי בנקים לפעימה שניה',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
};
const BankNumbersThirdPhase: DynamicField = {
  name: 'BankNumbersForThirdPhase',
  type: 'number',
  label: 'מספרי בנקים לפעימה שלישית',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
};

export const BankForeclosureForm = {
  Parking: [
    BankNumbersFirstPhase,
    BankNumbersSecondPhase,
    BankNumbersThirdPhase,
  ],
  General: [
    BankNumbersFirstPhase,
    BankNumbersSecondPhase,
    BankNumbersThirdPhase,
  ],
  Administrative: [
    BankNumbersFirstPhase,
    BankNumbersSecondPhase,
    BankNumbersThirdPhase,
  ],
};

// עיקול ברישום מטלטלין
const TaltalinForeclosureSignUp: DynamicField = {
  name: 'BankNumbersForThirdPhase',
  type: 'number',
  label: 'פרמטר ימים לתשלום',
  validations: {
    required: true,
    max: 90,
    min: 1,
  },
  hide: false,
  size: DynamicFieldSize.Regular,
};

export const TaltalinForeclosureSignUpForm = {
  Parking: [TaltalinForeclosureSignUp],
  General: [TaltalinForeclosureSignUp],
  Administrative: [TaltalinForeclosureSignUp],
};
