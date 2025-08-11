// export enum TicketStatusEnum {
//     PAY = 'סגור שולם',
//     CANCEL = 'בוטל',
//     OPEN = 'פתוח',
//     FREEZE = 'מוקפא',
//     PAY_PART = 'שולם חלקי',
//     PAY_SURPLUS = 'תשלום עודף-בזיכוי',
//     IN_ORDER = 'בהסדר',

// }

export enum TicketTypeEnum {
  ADMIN = 1,
  PARKING = 2,
  GENERAL = 3,
}

export enum FileTypeEnum {
  IMAGE = 1,
  VIDEO = 2,
  AUDIO = 3,
}

// export enum TicketStageEnum {
//     ALERT = 'התראה',
//     EVENT = 'אירוע',
//     REPORT_WINDOW = 'דוח חלון',
//     CLOSING_TRANSPOR = 'הלבשה משרד התחבורה',
//     CLOTHING_INTERIOR = 'הלבשה משרד הפנים',
//     PAYMENT_NOTICE = 'הודעת תשלום',
//     ENFORCEMENT = 'אכיפה'
// }

// export enum TicketSubStageEnum{
//     SENT_PRINT =  "נשלח לדפוס",
//     DATA_VERTIFICATION = "אימות נתונים משרד הפנים",
//     COPY_SHIPPING_REPORT = "העתק דוח משלוח",
//     DELIVERY_APPROVAL = "אישור מסירה",
//     DOCUMENT_SCANNING = "סריקת  מסמכים"
// }

// export enum TicketResourceEnum{
//     TERMINAL = 'מסופון',
//     CAMERA = 'מצלמה',
//     MANUAL = 'ידני'
// }

export enum VehicleTypeEnum {
  COMMERICAL = 'מסחרי',
  PRIVATE = 'פרטי',
  COMMON = 'ציבורי',
}

export enum TicketsColumnEnum {
  TICKET_STATUS_ID = 'ticketStatusID',
}

export enum TicketTypeDisplayEnum {
  '' = 0,
  מנהלי = 1,
  חנייה = 2,
  כללי = 3,
  אכיפה = 4,
}

export enum TicketTypeForMapEnum{
  ADMIN = 'מנהלי',
  PARKING = 'חניה',
  GENERAL = 'כללי',
  ENFORCEMNT='אכיפה',
  EMPTY=''
}

export const TicketTypeEnumMap: { [key in TicketTypeForMapEnum]: number } = {
  [TicketTypeForMapEnum.ADMIN]: 1,
  [TicketTypeForMapEnum.PARKING]: 2,
  [TicketTypeForMapEnum.GENERAL]: 3,
  [TicketTypeForMapEnum.ENFORCEMNT]: 4,
  [TicketTypeForMapEnum.EMPTY]: -1, // Optional fallback for empty
};

export enum TicketStagesDisplayEnum {
  התראה = 1,
  אירוע = 2,
  דוח_חלון = 3,
  הלבשה_משרד_התחבורה = 4,
  הלבשה_משרד_הפנים = 5,
  הודעת_תשלום = 6,
  אכיפה_טופס_1 = 7,
  אכיפה_טופס_3 = 8,
  עיקול_בנק = 9,
  עיקול_מטלטלין_ברישום = 10,
  עיקול_מטלטלין_בפועל = 11,
}
