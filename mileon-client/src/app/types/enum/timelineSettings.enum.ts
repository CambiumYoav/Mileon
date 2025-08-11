export enum TimelineSettingsEnum {
  // חיי דוחות
  TicketTimeline = 'דוח חלון',
  TransportOffice = 'הלבשה ממשרד התחבורה',
  InformationAuth = 'אימות פרטים',
  EarlyNotice = 'הודעה מוקדמת',
  PaymentNotice = 'הודעת תשלום',
  AdminApprovedToEnforce = 'אישור מנהל לפעולות אכיפה',

  // צעדים
  ReportWindowStep = 'REPORT_WINDOW',
  MinistryTransportDetailStep = 'MINISTRY_OF_TRANSPORT_DETAIL',
  DetailVerificationStep = 'DETAIL_VERIFICATION',
  AdvanceNoticeStep = 'ADVANCE_NOTICE',
  PaymentNoticeStep = 'PAYMENT_NOTICE',
  AdminConfirmationStep = 'ADMIN_CONFIRMATION',

  // אכיפה
  DetailsConfirmation = 'אימות פרטים (מ.הפנים) / רשם החברות',
  OrderMessage = 'הודעת דרישה',
  FormThree = 'טופס 3',
  DebtReminder = 'תזכורת חוב',
  BankForeclosure = 'עיקול בנק',
  TaltalinForeclosureSignUp = 'עיקול מטלטלין - ברישום',
  TaltalinForeclosureOnGoing = 'עיקול מטלטלין - בפועל',
  VehicleForeclosureSignUp = 'עיקולי רכב - רישום',
  VehicleForeclosureOnGoing = 'עיקולי רכב - בפועל ',
  ThirdSideForeclosure = 'עיקולי צד ג׳',

  // צעדים
  MinistryInteriorDetailStep = 'MINISTRY_OF_INTERIOR_DETAIL',
  DemandNoticeStep = 'DEMAND_NOTICE',
  FormThreeStep = 'FORM3',
  DebtReminderStep = 'DEBT_REMINDER',
  BankForeclosureStep = 'BANK_FORECLOSURE',
  RegisteredPropertyForeclosureStep = 'REGISTERED_PROPERTY_FORECLOSURE',
  ActualPropertyForeclosureStep = 'ACTUAL_PROPERTY_FORECLOSURE',
  RegisteredCarForeclosureStep = 'REGISTERED_CAR_FORECLOSURE',
  ActualCarForeclosureStep = 'ACTUAL_CAR_FORECLOSURE',
  ThirdPartyForeclosureStep = 'THIRD_PARTY_FORECLOSURE',
}

export enum StepsDescriptionEnum {
  // דוח חלון
  TicketTimeline = 'כל הדוחות החדשים שנקלטים במערכת דוחות יכולים להגיע ממסופון ע"י פקח או ממצלמות בממשקים שונים',
  TransportOffice = 'ממשק מול משרד התחבורה לקבלת פרטי הנהג הממשק מנוהל במסך "ממשקים - משרד תחבורה"',
  InformationAuth = 'ימות פרטים מחייב בחוק בשלב 7 טרם משל הודו דרישה לחייב שלב זה הינו שלב רשות בו ע"פ רישת רשות, לבצע אימות יזום של קובץ החייבים בממשק מול משרד הפנים רשם החברות פונה לממשק רשם החברות ומתייחס לחברות לכתובת הרשומה ברשם',
  EarlyNotice = 'שלב פנימי טרם משלוח הודעה בדואר רשום הבא להטיב עם הרשות בהקטנת עלויות דרישה זו הינה בדואר רגיל ולא מחוייבת בהוראות החוק חייבים אשר שמו את ישה ישלחו במנה "ה תשלום" כמחייב הוראות החוק)',
  PaymentNotice = 'שלב מחייב בחוק משלוח הודעה הדואר רשום סכום קנס מקור לתשלום בטווח קבוע של 90 יום',
  AdminApprovedToEnforce = 'בהתאם לחוק חברות הגביה נדרשת אישור הרשות עבור כל דוח שחלף תאריך הקובע וברצון הרשות לבצע נקיטת תהליכי אכיפה',

  // אכיפה
  DetailsConfirmation = 'אימות פרטים מחייב בחוק בשלב 7 טרם משל הודו דרישה לחייב רשם החברות פונה לממשק רשם החברות ומתייחס לחברות לכתובת הרשומה ברשם',
  OrderMessage = 'דרישה בדואר רגיל מחוייבת בהוראות החוק ימים לתשלום בבחירת הרשות שלא יקטן מ21 יום ברירת מחדל במערכת - 30 יום',
  FormThree = 'דרישה מחיויבת בחוק במשלוח דואר רשום + אישור מסירה למעט יישוי איו"ש המחויבים ו בלבד ללא אישור מסירה משך זמן לתשלום לא יקטן מ15 יום',
  DebtReminder = 'ב שליחת הודעת תזכורת חוב ע"י רישת שות דרישה שנשלחת בדואר רגיל או רשום, בהתאם למדיניות הרשות מוגדר בתהלי הפקות)',
  BankForeclosure = 'שלב של נקיטת תהליכים מתקדמים בתהליך האכיפה הטלת עיקול בחשבון החייב. נדרש להגדיר את הבנקים אשר יתוייגו עבור כל פעמיה',
  TaltalinForeclosureSignUp = 'בקשה לצו עיקול מטלטלין בנכסי החייב כתובת המגור) בשלב ראשון מגיע גובה מס לביתו לשם תיעוד החפצים / מטלטלין הניתנים לעיקול בהתאם להוראות החוק זמן להגדרת ימים להסדרת תשלום מינימון 7 ימים ומקסימום 30 יום',
  TaltalinForeclosureOnGoing = 'צו לתפיסת מטלטלין אשר מתבצע בפועל ע"י ובה ס בבית החייב. הגובה רשאי לעקל את נכסי החייב אשר נרשמו בצו ברישום',
  VehicleForeclosureSignUp = 'בקשה למשרד התחבורה לרישום עיקול על הרכב אשר נמצא בבעלות החייב כל רכ בבו) לטובת שות המעקלת',
  VehicleForeclosureOnGoing = 'תפיסה בפועל של הרכב וגרירה למגרש לטובת מכירת רכב/ פירוק הכסף שיתקבל ילך לסגירת החוב בהתאם לגובה היתרה במקרה של דף, העודף',
  ThirdSideForeclosure = 'צווים נוספים הניתנים לעיקול במסגרת החוק כדוגמת עיקול בחברות אשראי/ מעסיק שכר ועוד',
}

export enum DescriptionTransportSteps {
  send = 'נשלח להלבשה',
  complete = 'הולבש פרטים',
  error = 'שגיאה - לא הולבש',
}

export enum InformationAuthSteps {
  send = 'נשלח לאימות',
  complete = 'עבר אימות',
  error = 'שגיאה- לא מאומת',
}

export enum EarlyNoticeSteps {
  stepOne = 'הפקת מנה- נשלח לדפוס',
  stepTwo = 'ממתין לאישור משלוח',
  stepThree = 'נשלח לחייב',
}
export enum PaymentNoticeSteps {
  stepOne = 'הפקת מנה- נשלח לדפוס',
  stepTwo = 'ממתין לאישור משלוח',
  stepThree = 'נשלח לחייב',
}
export enum AdminApprovedToEnforceSteps {
  stepOne = 'אישור מנהל לפעולות אכיפה',
}

export enum DetailsConfirmationSteps {
  send = 'נשלח לאימות',
  complete = 'עבר אימות',
  error = 'שגיאה- לא מאומת',
}

export enum OrderMessageSteps {
  stepOne = 'הפקת מנה- נשלח לדפוס',
  stepTwo = 'ממתין לאישור משלוח',
  stepThree = 'נשלח לחייב',
}

export enum FormThreeSteps {
  stepOne = 'הפקת מנה- נשלח לדפוס',
  stepTwo = 'ממתין לאישור משלוח',
  stepThree = 'נשלח לחייב',
}

export enum DebtReminderSteps {
  stepOne = 'הפקת מנה- נשלח לדפוס',
  stepTwo = 'ממתין לאישור משלוח',
  stepThree = 'נשלח לחייב',
}

export enum BankForeclosureSteps {
  stepOne = 'נשלח לעיקול בנק',
  stepTwo = 'נרשם עיקול בנק',
}

export enum TimelineStepsType {
  Enforcement = 'Enforcement',
  TicketLifetime = 'TicketLifetime',
}

export enum TimelineApi {
  EnforcementSettingsUpdates = 'Enforcement Settings Updated',
}
