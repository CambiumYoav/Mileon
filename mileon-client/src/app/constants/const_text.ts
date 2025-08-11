export class ConstText {
    public static ticketsColumnsWithMoreTickets = [
        { sortDown: false, name: 'ticketStatusID', display: 'סטטוס' },
        { sortDown: false, name: 'authorityName', display: 'עירייה' },
        { sortDown: false, name: 'nid', display: 'מספר זהות' },
        { sortDown: false, name: 'name', display: 'שם מלא' },
        { sortDown: false, name: 'violationDate', display: 'תאריך עבירה', type: 'Date' },
        { sortDown: false, name: 'ticketNumber', display: 'מספר דוח' },
        { sortDown: false, name: 'ticketTypeID', display: 'סוג דוח' },
        { sortDown: false, name: 'ticketStageID', display: 'שלב' },
        { sortDown: false, name: 'paymentBalance', display: 'יתרה' },
        { name: 'additionalTicketPaymentBalance', display: 'דוחות נוספים' }
    ]

    public static ticketColumnsWithNID = [
        { sortDown: false, name: 'ticketStatusID', display: 'סטטוס' },
        { sortDown: false, name: 'authorityName', display: 'עירייה' },
        { sortDown: false, name: 'nid', display: 'מספר זהות' },
        { sortDown: false, name: 'name', display: 'שם מלא' },
        { sortDown: false, name: 'violationDate', display: 'תאריך עבירה', type: 'Date' },
        { sortDown: false, name: 'ticketNumber', display: 'מספר דוח' },
        { sortDown: false, name: 'ticketTypeID', display: 'סוג דוח' },
        { sortDown: false, name: 'ticketStageID', display: 'שלב' },
        { sortDown: false, name: 'paymentBalance', display: 'יתרה' }
    ]
    public static ticketColumnsWithVehicleNumber = [
        { sortDown: false, name: 'ticketStatusID', display: 'סטטוס' },
        { sortDown: false, name: 'authorityName', display: 'עירייה' },
        { sortDown: false, name: 'vehicleNumber', display: 'מספר רכב' },
        { sortDown: false, name: 'name', display: 'שם מלא' },
        { sortDown: false, name: 'violationDate', display: 'תאריך עבירה', type: 'Date' },
        { sortDown: false, name: 'ticketNumber', display: 'מספר דוח' },
        { sortDown: false, name: 'ticketTypeID', display: 'סוג דוח' },
        { sortDown: false, name: 'ticketStageID', display: 'שלב' },
        { sortDown: false, name: 'paymentBalance', display: 'יתרה' }
    ]

    public static paymentForTicketColumns = ['תאריך יצירת', 'פרטים', 'חיוב', 'זיכוי', 'סכום מצטבר']

    public static columnsForTicketHistory = ['תאריך פעולה', 'סטטוס', 'שלב', 'תת שלב','תיאור פעולה', 'שם מלא', 'כתובת', 'משתמש מערכת']

    public static days = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

    public static daysLetter = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ש']

    public static paymentColumns = ['תאריך תשלום', ' שולם']

}

