import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { DynamicField } from '../infrastructure/InfrastructureTypes';
import { TerminalSettingRequest } from './terminalSettingsRequestType';

export class TerminalSettingsFields {
  public GeneralSettings: TerminalSettingRequest[] = [
    {
      displayName: 'רישום נוסף של לוחית רישוי',
      settingName: 'swEnterCar',
      value: '0',
      type: 'radio',
      isRequired: true,
    },
    {
      displayName: 'הדפסת מלל “ברירת משפט” במסופון',
      settingName: 'SwPrintDochBreratMispat',
      value: '0',
      type: 'radio',
    },

    {
      displayName: 'בדיקת חניה סלולרית לעבירות חמורות',
      settingName: 'SevereOffenseCellularParkingCheck',
      value: '0',
      type: 'select',
    },
    {
      displayName: 'תשאול כחול לבן כברירת מחדל',
      settingName: 'BlueWhiteParking',
      value: '0',
      type: 'radio',
    },
    {
      displayName: "אפשרויות ביטול דוח ע''י פקח",
      settingName: 'SwNoDeleteDochMeshofon',
      value: '0',
      type: 'radio',
    },

    {
      displayName: 'הדפסת QR לתשלום עבור חניה/מנהלי/כללי',
      settingName: 'SWQR',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'הדפסת QR לתשלום עבור סיווגי עבירות',
      settingName: 'SWPrintQR',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'שימוש בפנקסי דוחות אזהרה',
      settingName: 'UseWarningTicketBooks',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'מקסימום פנקסים לפקח חניה',
      settingName: 'MaxParkingTicketBooksPerInspector',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'מקסימום פנקסים לפקח מנהלי',
      settingName: 'MaxTicketBooksPerInspector',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'מקסימום פנקסים לפקח כללי',
      settingName: 'MaxGeneralTicketBooksPerInspector',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'בדיקת דוח כפול',
      settingName: 'DuplicateTicketCheck',
      value: '',
      type: 'select',
    },
    {
      displayName: 'חובת הכנסת כתובות',
      settingName: 'AddAdress_Bool',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'הצגת מיקום תמונה',
      settingName: 'ShowLocation',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'זמנים להצגה בקוצב זמן חניה',
      settingName: 'ParkingTime',
      value: '0',
      type: 'select',
    },
    {
      displayName: 'קוד הערת פקח להדפסה בקוצב זמן חניה',
      settingName: 'InspectotCodeInParkingTime',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'קוד הערת פקח לביטול בקוצב זמן חניה',
      settingName: 'InspectotCodeInParkingCancelTime',
      value: '0',
      type: 'select',
    },
    {
      displayName: 'הפקת דו"חות אזהרה',
      settingName: 'PrintWarningTickets',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'מינימום תמונות לדוח חניה',
      settingName: 'SwPicHanaya',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'מינימום תמונות לדוח מנהלי',
      settingName: 'SwPicAdmin',
      value: '0',
      type: 'number',
    },
    {
      displayName: 'מינימום תמונות לדוח כללי',
      settingName: 'SwPicGeneral',
      value: '0',
      type: 'number',
    },

    {
      displayName: 'בחירת תמונה מרכב נכה',
      settingName: 'SwchooseNechePic',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'משלוח שעת הפעלת חניה סלולרית',
      settingName: 'SendCellularParkingStartHour_Int',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'הצגת היסטוריית דוחות לפקח',
      settingName: 'ShowTicketsHistory',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'הדפסת הערות פקח',
      settingName: 'WorkMsfWithQRM',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'קיבוע רחוב מדוח קודם',
      settingName: 'LastDochStreet',
      value: '0',
      type: 'radio',
    },
    {
      displayName: 'גרסת אפליקציה',
      settingName: 'VersionNO',
      value: '',
      type: 'text',
    },
    {
      displayName: 'גרסת אפליקציה - URL',
      settingName: 'versionURL',
      value: '',
      type: 'text',
    },
  ];
  public ExternalSettings: TerminalSettingRequest[] = [
    {
      displayName: 'סטטוס ממשק החזרים',
      settingName: 'RefundInterfaceStatus',
      value: '1',
      type: 'radio', // or 'checkbox' depending on how you render booleans
    },
    {
      displayName: 'שם משתמש פנגו',
      settingName: 'PangoUsername',
      value: '',
      type: 'text',
    },
    {
      displayName: 'סיסמה פנגו',
      settingName: 'PangoPassword',
      value: '',
      type: 'password',
    },
    {
      displayName: 'שם משתמש סלופארק',
      settingName: 'CelloParkUsername',
      value: '',
      type: 'text',
    },
    {
      displayName: 'סיסמה סלופארק',
      settingName: 'CelloParkPassword',
      value: '',
      type: 'password',
    },
    {
      displayName: 'תשאול פנגו',
      settingName: 'PangoInquiry',
      value: '1',
      type: 'radio',
    },
    {
      displayName: 'תשאול סלופארק',
      settingName: 'CelloParkInquiry',
      value: '0',
      type: 'radio',
    },
  ];
  public IconAssignmentsSettings: TerminalSettingRequest[] = [
    // Parking violations
    {
      displayName: 'שני גלגלים',
      settingName: 'TwoWheels',
      value: '1',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'ארבע גלגלים על מדרכה',
      settingName: 'FourWheelsOnSidewalk',
      value: '2',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה בתחנת אוטובוס/מונית',
      settingName: 'ParkingInBusOrTaxiStop',
      value: '3',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה במעבר חציה',
      settingName: 'ParkingOnCrosswalk',
      value: '4',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חנייה כפולה',
      settingName: 'DoubleParking',
      value: '5',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניית נכה',
      settingName: 'DisabledParking',
      value: '6',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה בצומת',
      settingName: 'IntersectionParking',
      value: '7',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'כחול לבן',
      settingName: 'BlueAndWhite',
      value: '8',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'אדום לבן',
      settingName: 'RedAndWhite',
      value: '9',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'משאית מעל 6 טון',
      settingName: 'TruckOver6Tons',
      value: '10',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'X',
      settingName: 'XMark',
      value: '11',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'V',
      settingName: 'VMark',
      value: '12',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה בניגוד לתמרור',
      settingName: 'ParkingAgainstSign',
      value: '13',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'מעבר חציה',
      settingName: 'Crosswalk',
      value: '14',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה בתחנת אוטובוס',
      settingName: 'BusStationParking',
      value: '15',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה בתחנת מוניות',
      settingName: 'TaxiStationParking',
      value: '16',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'תמרור 435',
      settingName: 'Sign435',
      value: '17',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חסימת נתיב',
      settingName: 'LaneBlocking',
      value: '18',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'אי תנועה',
      settingName: 'TrafficIsland',
      value: '19',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'כניסה לשטח',
      settingName: 'EntryToArea',
      value: '20',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'שני גלגלים על מדרכה-אזור קנס מוגדל',
      settingName: 'TwoWheelsSidewalkIncreasedFine',
      value: '21',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חסימת נתיב-אזור  קנס מוגדל',
      settingName: 'LaneBlockingIncreasedFine',
      value: '22',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'ארבע גלגלים על מדרכה-אזור קנס מוגדל',
      settingName: 'FourWheelsSidewalkIncreasedFine',
      value: '23',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חנייה בצומת -אזור קנס מוגדל',
      settingName: 'IntersectionParkingIncreasedFine',
      value: '24',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'מעבר חציה-אזור קנס מוגדל',
      settingName: 'CrosswalkIncreasedFine',
      value: '25',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'חניה באוטובוס -אזור קנס מוגדל',
      settingName: 'BusStationParkingIncreasedFine',
      value: '26',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'אדום לבן -אזור קנס מוגדל',
      settingName: 'RedAndWhiteIncreasedFine',
      value: '27',
      type: 'number',
      isParking: true,
    },
    {
      displayName: 'הפרעה לתנועה אזור קנס מוגדל',
      settingName: 'TrafficDisruptionIncreasedFine',
      value: '29',
      type: 'number',
      isParking: true,
    },

    // General violations
    {
      displayName: 'אופנוע /תלת אופן',
      settingName: 'MotorcycleOrTricycle',
      value: '30',
      type: 'number',
    },
    {
      displayName: 'קורקינט ממונע',
      settingName: 'ElectricScooter',
      value: '31',
      type: 'number',
    },
    {
      displayName: 'הולך רגל',
      settingName: 'Pedestrian',
      value: '32',
      type: 'number',
    },
    {
      displayName: 'בריאות הציבור',
      settingName: 'PublicHealth',
      value: '33',
      type: 'number',
    },
    {
      displayName: 'קורונה',
      settingName: 'Covid',
      value: '34',
      type: 'number',
    },
    {
      displayName: 'שילוט ופרסום',
      settingName: 'SignageAndAdvertising',
      value: '35',
      type: 'number',
    },
    {
      displayName: 'פינוי אשפה',
      settingName: 'GarbageRemoval',
      value: '36',
      type: 'number',
    },
    {
      displayName: 'ניקוי מדרכות',
      settingName: 'SidewalkCleaning',
      value: '37',
      type: 'number',
    },
    {
      displayName: 'עישון',
      settingName: 'Smoking',
      value: '38',
      type: 'number',
    },
    {
      displayName: 'מניעת רעש',
      settingName: 'NoisePrevention',
      value: '39',
      type: 'number',
    },
    {
      displayName: 'מפגעי תברואה',
      settingName: 'SanitationHazards',
      value: '40',
      type: 'number',
    },
    {
      displayName: 'וטרינרי',
      settingName: 'Veterinary',
      value: '41',
      type: 'number',
    },
    {
      displayName: 'נטוש',
      settingName: 'Abandoned',
      value: '42',
      type: 'number',
    },
    {
      displayName: 'שמירת הניקיון',
      settingName: 'CleanlinessEnforcement',
      value: '43',
      type: 'number',
    },
    {
      displayName: 'צעצועים מסוכנים',
      settingName: 'DangerousToys',
      value: '44',
      type: 'number',
    },
    {
      displayName: 'פינוי פסולת',
      settingName: 'WasteRemoval',
      value: '45',
      type: 'number',
    },
    {
      displayName: 'פינוי חפצים מיושנים',
      settingName: 'OldItemsRemoval',
      value: '46',
      type: 'number',
    },
    {
      displayName: 'ניקוי חצרות וכניסה לבתים',
      settingName: 'YardAndEntranceCleaning',
      value: '47',
      type: 'number',
    },
    {
      displayName: 'החזקת בעל חיים',
      settingName: 'AnimalOwnership',
      value: '48',
      type: 'number',
    },
    {
      displayName: 'החרמה',
      settingName: 'Confiscation',
      value: '49',
      type: 'number',
    },
    {
      displayName: 'תלת אופניים חשמליים',
      settingName: 'ElectricTricycle',
      value: '50',
      type: 'number',
    },
    {
      displayName: 'רוכלות ואיסוף תרומות',
      settingName: 'PeddlingAndDonations',
      value: '51',
      type: 'number',
    },
    {
      displayName: 'שימור רחובות',
      settingName: 'StreetPreservation',
      value: '52',
      type: 'number',
    },
    {
      displayName: 'פתיחת בתי עסק וסגירתם',
      settingName: 'BusinessOpeningAndClosing',
      value: '53',
      type: 'number',
    },
    {
      displayName: 'עקירת עצים',
      settingName: 'TreeUprooting',
      value: '54',
      type: 'number',
    },
    {
      displayName: 'אופניים',
      settingName: 'Bicycles',
      value: '55',
      type: 'number',
    },
  ];
}

export const mapTerminalSettingsToDynamicFields = (
  settings: TerminalSettingRequest[]
): DynamicField[] | any[] => {
  const optionsMap: {
    [fieldName: string]: { label: string; value: any; display: string }[];
  } = {
    SevereOffenseCellularParkingCheck: [
      { value: '0', label: '', display: '' },
      { value: '1', label: 'בדיקה והתראה', display: 'בדיקה והתראה' },
      { value: '2', label: 'בדיקה ללא התראה', display: 'בדיקה ללא התראה' },
      { value: '3', label: 'ללא בדיקה', display: 'ללא בדיקה' },
    ],
    DuplicateTicketCheck: [
      { value: '0', label: '', display: '' },
      { value: '1', label: 'לפי מספר רכב', display: 'לפי מספר רכב' },
      { value: '2', label: 'מספר רכב ועבירה', display: 'מספר רכב ועבירה' },
      {
        value: '3',
        label: 'מספר רכב, עבירה ורחוב',
        display: 'מספר רכב, עבירה ורחוב',
      },
    ],
    ParkingTime: [
      { value: '0', label: '', display: '' },
      { value: '1', label: 'עד 15 דקות', display: 'עד 15 דקות ' },
      { value: '2', label: 'עד 30 דקות', display: 'עד 30 דקות' },
      { value: '3', label: 'עד 45 דקות', display: 'עד 45 דקות' },
      { value: '4', label: 'עד 60 דקות', display: 'עד 60 דקות' },
      { value: '5', label: 'עד 90 דקות', display: 'עד 90 דקות' },
    ],
    InspectotCodeInParkingCancelTime: [
      { value: '0', label: '', display: '' },
      { value: '1', label: 'בדיקה והתראה', display: 'בדיקה והתראה' },
      { value: '2', label: 'בדיקה ללא התראה', display: 'בדיקה ללא התראה' },
      { value: '3', label: 'ללא בדיקה', display: 'ללא בדיקה' },
    ],
  };

  // Define fields that should have strict integer validation (no decimals, max 3 digits)
  const strictIntegerFields = ['SwPicHanaya', 'SwPicAdmin', 'SwPicGeneral'];

  const versionFields = ['VersionNO'];

  // Define fields that should only accept integers (no decimals) but may have different max values

  return settings.map((setting) => {
    // Determine validation rules based on field type and name
    let validations: any = undefined;

    if (versionFields.includes(setting.settingName)) {
      // Version number validation - allows formats like 1.2.32, 1.0, 1, etc.
      validations = {
        pattern: /^(\d+)(\.\d+)*$/, // Matches: 1, 1.2, 1.2.3, 1.2.3.4, etc.
        maxLength: 20, // Allow reasonable length for version numbers
        errorMessages: {
          pattern: 'יש להזין מספר גרסה תקין (לדוגמה: 1.2.32 או 1.0 או 1)',
        },
      };
    }
    if (setting.type === 'number') {
      if (strictIntegerFields.includes(setting.settingName)) {
        // Fields that need 1-16 range and no decimals
        validations = {
          min: 1,
          max: 16,
          pattern: /^[1-9]\d{0,1}$|^1[0-6]$/, // Only integers 1-16, no decimals
          maxLength: 2,
          integer: true, // Custom validation flag
          errorMessages: {
            pattern: 'יש להזין מספר שלם בין 1 ל-16',
            min: 'הערך המינימלי הוא 1',
            max: 'הערך המקסימלי הוא 16',
          },
        };
      } else {
        // Default number validation
        validations = {
          min: 0,
          max: 999,
          maxLength: 3,
          pattern: /^\d{1,3}$/, // Default to integers only, 3 digits max
          errorMessages: {
            pattern: 'יש להזין מספר עד 3 ספרות',
            max: 'מקסימום 3 ספרות',
          },
        };
      }
    }

    return {
      id: setting.id,
      name: setting.settingName,
      type: setting.type,
      label: setting.displayName,
      value: setting.value,
      hide: false,
      size: DynamicFieldSize.Regular,
      isRequired: true,
      disabled: setting.isDisabled,
      validations,
      // Add input restrictions
      inputMode: setting.type === 'number' ? 'numeric' : undefined,
      step: strictIntegerFields.includes(setting.settingName) ? '1' : undefined,
      options:
        setting.type === 'radio'
          ? [
              { label: 'כן', value: '0', display: 'כן' },
              { label: 'לא', value: '1', display: 'לא' },
            ]
          : setting.type === 'select'
          ? optionsMap[setting.settingName] || []
          : undefined,
    };
  });
};
