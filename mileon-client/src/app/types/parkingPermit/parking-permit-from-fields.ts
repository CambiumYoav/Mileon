import { TimeEnum } from '../enum/dateTypeEnum';
import { DynamicFieldSize } from '../enum/infrastructureTablesEnum';
import { WeekDays } from '../enum/weekDaysEnum';

import {
  DynamicField,
  DynamicRow,
} from '../infrastructure/InfrastructureTypes';

export class ParkingPermitsTypesForm {
  public PermitSettingsFields: DynamicField[] = [
    {
      name: 'permitsByIdCount',
      label: 'כמות תווים להנפקה לפי תעודת זהות',
      type: 'text',
      size: DynamicFieldSize.Medium,
      hide: false,
      isRequired: true,
      validations: { required: true, min: 0, max: 20, pattern: '^[0-9]*$' },
    },
  ];

  public PermitTypeSettingsFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'authorityPermitTypeID',
          label: ' קוד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: true,
          isRequired: true,
          value: null,
          validations: {},
        },
        {
          name: 'permitTypeDescription',
          label: 'תיאור התו',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 20,
          },
        },
        {
          name: 'cost',
          label: 'מחיר תו',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            pattern: /^(?:0|[1-9]\d{0,3})(?:\.\d{2})?$/,
            maxLength: 6,
            min: 0,
            max: 1000,
          },
        },
        {
          name: 'timeGivingPermit',
          label: 'משך תוקף התו שניתן לתושב',
          type: 'select',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
          },
          options: [
            { value: TimeEnum.Days, display: 'ימים' },
            { value: TimeEnum.Months, display: ' חודשים' },
            { value: TimeEnum.Years, display: 'שנים' },
            { value: TimeEnum.Dates, display: 'תאריכים' },
          ],
        },

        {
          name: 'permitDurationInDays',
          label: 'ימים',
          type: 'text', // or 'number' if your input supports it
          size: DynamicFieldSize.Medium,
          hide: false, // default visible
          isRequired: false,
          validations: {
            required: false, // will be set dynamically
            maxLength: 10, // עד 10 תווים
            pattern: '^[0-9]+$', // מספרים חיוביים (כולל 0)
            min: 0, // >= 0
          },
        },
        {
          name: 'permitDurationInYears',
          label: 'שנים',
          type: 'text', // or 'number' if your input supports it
          size: DynamicFieldSize.Medium,
          hide: false, // default visible
          isRequired: false,
          validations: {
            required: false, // will be set dynamically
            maxLength: 10, // עד 10 תווים
            pattern: '^[0-9]+$', // מספרים חיוביים (כולל 0)
            min: 0, // >= 0
          },
        },
        {
          name: 'permitDurationInMonths',
          label: 'חודשים',
          type: 'text', // or 'number' if your input supports it
          size: DynamicFieldSize.Medium,
          hide: false, // default visible
          isRequired: false,
          validations: {
            required: false, // will be set dynamically
            maxLength: 10, // עד 10 תווים
            pattern: '^[0-9]+$', // מספרים חיוביים (כולל 0)
            min: 0, // >= 0
          },
        },
        {
          name: 'permitStartDate',
          label: 'מ תאריך',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: true, // hidden until "תאריכים"
          isRequired: false,
          validations: {
            required: false, // will be set dynamically
          },
        },
        {
          name: 'permitEndDate',
          label: 'עד תאריך',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: true, // hidden until "תאריכים"
          isRequired: false,
          validations: {
            required: false, // will be set dynamically
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'activeDays',
          label: 'תקף בימים',
          type: 'checkboxOptions',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: '',
          isRequired: true,
          validations: {
            required: true,
          },
          // all week days
          checkBoxOptions: [
            { value: WeekDays.Sunday, label: 'ראשון' },
            { value: WeekDays.Monday, label: 'שני' },
            { value: WeekDays.Tuesday, label: 'שלישי' },
            { value: WeekDays.Wednesday, label: 'רביעי' },
            { value: WeekDays.Thursday, label: 'חמישי' },
            { value: WeekDays.Friday, label: 'שישי' },
            { value: WeekDays.Saturday, label: 'שבת' },
            { value: WeekDays.All, label: 'הכל' },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'timeRange',
          label: 'שעות התו',
          type: 'fromTo', // time
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
          },
          fields: [
            { name: 'fromTime', placeholder: 'מ-', value: '' },
            { name: 'toTime', placeholder: 'עד', value: '' },
          ],
        },
        // all day
        {
          // value 00:00-00:00
          name: 'allDay',
          label: 'שעות התו',
          type: 'checkboxOptions',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            // required: true,
          },
          checkBoxOptions: [{ value: true, label: 'כל שעות היממה' }],
        },
      ],
    },
    {
      row: [
        {
          name: 'allowRenewDaysCount',
          label: 'ימים לחידוש לפני פקיעת תוקף',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          value: 30,
          validations: {
            required: true,
            pattern: /^[0-9]*$/,
            min: 0,
            max: 182,
          },
        },
        {
          name: 'allowRenewDaysCountAferExp',
          label: 'ימים לחידוש אחרי פקיעת תוקף',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          value: 0,
          validations: {
            required: true,
            pattern: /^[0-9]*$/,
            min: 0,
            max: 182,
          },
        },
        // דרש לוודא כי ימים לחידוש קטן או שווה למשך תוקף התו
        {
          name: 'smsRenewDaysCount',
          label: 'ימים לשליחת סמס לפני פג תוקף',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          value: 30,
          validations: {
            required: true,
            pattern: /^[0-9]*$/,
            min: 0,
            max: 182,
          },
        },
        // נדרש לוודא כי ימים לחידוש קטן או שווה למשך תוקף התו

        {
          name: 'casualParkingSlot',
          label: 'חניה מזדמנת',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: false,
          isRequired: false,
          validations: {
            required: false,
          },
          radioOptions: [
            { value: true, label: 'כן' },
            { value: false, label: 'לא' },
          ],
          //   options: [
          //     { value: true, display: 'כן' },
          //     { value: false, display: 'לא' },
          //   ],
        },
      ],
    },
    {
      row: [
        // disbale by casula
        {
          name: 'noFeeNeededDuration',
          label: 'משך זמן חניה ללא תשלום בדקות',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: true,
          // isRequired: true,
          validations: {
            required: true, // fixme
            pattern: /^[0-9]*$/,
            min: 0,
            max: 1440,
            maxLength: 4,
            // required:false
          },
        },

        {
          name: 'leftSideMasoufun',
          label: 'הודעה למסופון צד שמאל',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: false,
          isRequired: false,
          validations: {
            required: false,
          },
          radioOptions: [
            { value: true, label: 'המשך' },
            { value: false, label: 'ביטול' },
          ],
        },
        {
          name: 'rightSideMasoufun',
          label: 'הודעה למסופון צד ימין',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          value: false,
          validations: {
            required: false,
          },
          radioOptions: [
            { value: true, label: 'המשך' },
            { value: false, label: 'ביטול' },
          ],
        },

        {
          name: 'permitsByType',
          label: 'כמות תווים להנפקה לפי סוג תו',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          value: 1,
          validations: {
            required: false,
            pattern: '^[0-9]*$',
            min: 1,
            max: 10,
            maxLength: 3,
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'autoTicketCancellation',
          label: 'בדיקת דוח לביטול אוטומטי',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          value: false,
          validations: {
            required: false,
          },

          radioOptions: [
            { value: true, label: 'כן' },
            { value: false, label: 'לא' },
          ],
        },
        {
          name: 'mailApproveTemplate',
          label: 'טקסט לאישור תו במייל',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          isMultiSelect: false,
          validations: {
            required: false,
          },
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'smsApproveTemplate',
          label: 'טקסט לאישור תו בסמס ',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
          },
          isMultiSelect: false,
          dataFunction: {
            name: 'getTextTemplates',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
            ],
          },
        },
        {
          name: 'letterOfDeclaration',
          label: 'מכתב להצהרה',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: true,
          isRequired: false,
          validations: {
            required: false,
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'canRenewNumberOfRequests',
          label: 'מספר הבקשות לחידוש תו ',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            pattern: '^[0-9]*$',
            maxLength: 3,
            min: 1,
            max: 10,
          },
        },
        {
          name: 'manAgeSeniorResident',
          label: ' הטבה לתו ותיק - גיל גבר',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: 60,
          validations: {
            pattern: '^[0-9]*$',
            min: 50,
            max: 150,
          },
        },
        {
          name: 'womanAgeSeniorResident',
          label: 'הטבה לתו ותיק - גיל אישה',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: 60,
          validations: {
            pattern: '^[0-9]*$',
            min: 50,
            max: 150,
          },
        },

        {
          name: 'parkingPermitPrinting',
          label: 'סוג הדפסה',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,

          validations: {},

          radioOptions: [
            { value: 0, label: 'מדבקה' },
            { value: 1, label: 'וירטואלי' },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'isRealPermit',
          label: 'האם תו אמיתי  ',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          value: false,
          validations: {},
          radioOptions: [
            { value: true, label: 'כן' },
            { value: false, label: 'לא' },
          ],
        },
        {
          name: 'areasId',
          label: 'אזורים ',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,

          validations: {},
          dataFunction: {
            name: 'getAreas',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityIDs',
              },
            ],
          },
        },
        {
          name: 'authorityID',
          label: ' קוד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          disabled: true,
          isRequired: true,
          validations: {
            required: true,
          },
        },
        {
          name: 'allAreasSelected',
          label: ' קוד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          disabled: true,
          isRequired: true,
          validations: {
            required: true,
          },
        },
        {
          name: 'areasIdOrignal',
          label: 'אזורים ',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: true,
          isMultiSelect: true,
          validations: {},
          dataFunction: {
            name: 'getAreas',
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authority  IDs',
              },
            ],
          },
        },
      ],
    },
  ];
}

export class ParkingPermitCreateUpdateForm {
  public ParkingPermitPersonalDetailsFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'firstName',
          label: ' שם פרטי',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: false,
          isRequired: true,
          value: null,
          validations: {
            required: true,
            maxLength: 20,
            pattern: /^(?:[a-zA-Z\s]+|[\u0590-\u05FF\s]+)$/,
          },
        },
        {
          name: 'lastName',
          label: 'שם משפחה',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 20,
            pattern: /^(?:[a-zA-Z\s]+|[\u0590-\u05FF\s]+)$/,
          },
        },
        {
          name: 'nid',
          label: 'תעודת זהות ',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: false,

            maxLength: 9,
          },
        },
        {
          name: 'passportID',
          label: ' דרכון',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          isRequired: true,
          validations: {
            required: false,

            maxLength: 9,
          },
        },

        {
          name: 'isNidORPassport',
          label: 'סוג מזהה',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          value: '0',
          validations: {
            required: true,
          },
          options: [
            { value: '0', display: 'תעודת זהות' },
            { value: '1', display: 'דרכון' },
          ],
        },
        {
          name: 'birthDate',
          label: 'תאריך לידה',
          type: 'date',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            // add custom validation
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'genderID',
          label: 'מין',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          value: '1',
          validations: {
            required: true,
          },
          options: [
            { value: '1', display: 'זכר' },
            { value: '2', display: 'נקבה' },
          ],
        },
        {
          name: 'mainPhone',
          label: 'טלפון נייד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 10,
            pattern: /^05\d{8}$/,
          },
        },
        {
          name: 'email',
          label: 'דואר אלקטרוני',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 30,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          },
        },
        {
          name: 'cityID',
          label: ' יישוב',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
          },
          isMultiSelect: false,
          dataFunction: {
            name: 'getCities',
            // extraParams: [
            //   {
            //     connectedField: 'authorityID',
            //     paramName: 'authorityIDs',
            //   },
            // ],
          },
        },
        {
          name: 'streetID',
          label: 'רחוב',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          isMultiSelect: false,
          validations: {
            required: true,
          },
          dataFunction: {
            name: 'getStreets',
            //FIXME
            extraParams: [
              {
                connectedField: 'authorityID',
                paramName: 'authorityIDs',
              },
              // {
              //   connectedField: 'cityID',
              //   paramName: 'city',
              // },
              // {

              //   connectedField: 'cityID',
              //   paramName: 'cityIDs',
              // },
            ],
            // extraParams: [
            //   {
            //     connectedField: 'cityID',
            //     paramName: 'cityIDs',
            //   },
            // ],
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'houseNumber',
          label: 'מספר בית',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 5,
            pattern: '^[0-9]*$',
          },
        },
        {
          name: 'apartment',
          label: 'דירה',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            maxLength: 5,
            pattern: '^[0-9]*$',
          },
        },
        {
          name: 'entrance',
          label: 'כניסה',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: false,
          validations: {
            required: false,
            maxLength: 5,
            pattern: '^[0-9]*$',
          },
        },
        {
          name: 'postalCode',
          label: 'מיקוד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 7,
            pattern: '^[0-9]*$',
          },
        },
        {
          name: 'mailbox',
          label: 'ת.ד.',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
            maxLength: 7,
            pattern: '^[0-9]*$',
          },
        },
      ],
    },
    {
      row: [
        {
          name: 'permitTypeByStreet',
          label: 'סוג תו',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: true,
          isRequired: true,
          value: null,
          isMultiSelect: false,
          validations: { required: true },
          dataFunction: {
            name: 'getParkingPermitTypesByAuthority',
            extraParams: [
              {
                connectedField: 'streetID',
                paramName: 'streetsIDs',
              },
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
              // {
              //   connectedField: 'streetID',
              //   paramName: 'streetId',
              // },
            ],
          },
        },
        {
          name: 'permitType',
          label: 'סוג תו',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: true,
          disabled: true,
          isRequired: true,
          value: null,
          isMultiSelect: false,
          validations: { required: true },
          dataFunction: {
            name: 'getParkingPermitTypesByAuthority',
            extraParams: [
              //   {
              //   connectedField: 'streetID',
              //   paramName: 'streetsIDs',
              // },
              {
                connectedField: 'authorityID',
                paramName: 'authorityID',
              },
              // {
              //   connectedField: 'streetID',
              //   paramName: 'streetId',
              // },
            ],
          },
        },
        {
          name: 'isHomeAddressPermit',
          label: 'האם תו דייר לכתובת מגורים',
          type: 'radio',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          value: false,
          validations: {
            required: true,
          },
          options: [
            { value: true, display: 'כן' },
            { value: false, display: 'לא' },
          ],
        },
        {
          name: 'authorityID',
          label: ' קוד',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: true,
          disabled: true,
          isRequired: true,
          validations: {
            required: true,
          },
        },
      ],
    },
  ];

  public ParkingPermitVehicleDetailsFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'vehicleNumber',
          label: 'מספר רישוי',
          type: 'text',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: false,
          isRequired: true,
          value: null,
          validations: { required: true, maxLength: 10, pattern: '^[0-9]*$' },
        },
        {
          name: 'modelID',
          label: ' סוג רכב',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          disabled: false,
          isRequired: true,
          value: null,
          isMultiSelect: false,
          validations: { required: true },
          dataFunction: {
            name: 'getVehicleTypes',
            // objName: 'vehicleTypes',
          },
        },
        {
          name: 'colorID',
          label: 'צבע רכב ',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          validations: {
            required: true,
          },
          isMultiSelect: false,
          dataFunction: {
            name: 'getVehicleColors',
            // objName: 'vehicleColors',
          },
        },
        {
          name: 'manufacturerID',
          label: 'יצרן רכב',
          type: 'selectWithLookup',
          size: DynamicFieldSize.Medium,
          hide: false,
          isRequired: true,
          isMultiSelect: false,
          validations: {
            required: true,
          },
          dataFunction: {
            name: 'getVehicleManufacturer',
            // objName: 'vehicleManufacturers',
          },
        },
      ],
    },
  ];

  public ParkingPermitScansFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'comments',
          label: 'הערות  ',
          type: 'text-area',
          size: DynamicFieldSize.Square,
          hide: false,
          disabled: false,
          isRequired: false,
          value: null,
          validations: { required: false, maxLength: 300 },
        },
      ],
    },
  ];

  public ParkingPermitSummaryFields: DynamicRow[] = [
    {
      row: [
        {
          name: 'isTermsAccepted',
          label: ' אישור הצהרה',
          type: 'checkboxOptions',
          size: DynamicFieldSize.FullWidth,
          hide: false,
          disabled: false,
          isRequired: true,
          validations: {
            required: true,
          },
          checkBoxOptions: [
            {
              value: true,
              label:
                'הריני מצהיר בזאת כי כל הפרטים לעיל נכונים ומלאים . ידוע לי כי דיווח חלקי או כוזב הינה עבירה על החוק, וכן ידוע לי כי לרשות יש זכות לבדוק את נכונות הפרטים הנל בכל האמצעים העומדים לרשותה כחוק.',
            },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'isDetailsConfirmed',
          label: ' אישור פרטים',
          type: 'checkboxOptions',
          size: DynamicFieldSize.FullWidth,
          hide: false,
          disabled: false,
          isRequired: true,
          validations: {
            required: true,
          },
          checkBoxOptions: [
            {
              value: true,
              label:
                'אני מאשר/ת כי הפרטים שמילאתי נכונים ומלאים, וכי אני זה/זו שמסר/ה אותם',
            },
          ],
        },
      ],
    },
    {
      row: [
        {
          name: 'sendReminderWhenExpired',
          label: 'קבלת תזכורות ',
          type: 'checkboxOptions',
          size: DynamicFieldSize.FullWidth,
          hide: false,
          disabled: false,
          isRequired: false,
          validations: {
            required: false,
          },
          checkBoxOptions: [
            {
              value: true,
              label:
                'אני מעוניין/ת לקבל תזכורות על תשלום דו"חות או תשלומים נדרשים אחרים בSMS ו/או דוא"ל',
            },
          ],
        },
      ],
    },
  ];
}
