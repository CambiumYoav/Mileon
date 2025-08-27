import {
  AdvancedForm,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../../advanced-search/form-tab.model';
import { FilterOptions } from '../filterOptions';
import { Patterns } from '../../../validators/validationPatterns';

export class TicketFilterOptions extends FilterOptions {
  violationDetailsFilter?: ViolationDetailsFilter;
  ownerDetailsFilter?: OwnerDetailsFilter;
  sourceDetailsFilter?: SourceDetailsFilter;
  actionsFilter?: ActionsFilter;
  otherFilter?: OtherFilter;
  interfaceFilter?: InterfaceFilter;

  constructor(args: TicketFilterOptions) {
    super();
    this.violationDetailsFilter =
      args?.violationDetailsFilter || new ViolationDetailsFilter({});
    this.ownerDetailsFilter =
      args?.ownerDetailsFilter || new OwnerDetailsFilter({});
    this.sourceDetailsFilter =
      args?.sourceDetailsFilter || new SourceDetailsFilter({});
    this.actionsFilter = args?.actionsFilter || new ActionsFilter({});
    this.otherFilter = args?.otherFilter || new OtherFilter({});
    this.interfaceFilter = args?.interfaceFilter || new InterfaceFilter({});
  }
}

export class InterfaceFilter {
  violationDate?: Date;
  ticketTypeName?: string;
  ticketID?: string;
  violationID?: number;
  violationSection?: string;
  violationDescription?: string;
  violationIDs?: string[];
  ticketSourceID?: number[];
  stageID?: number[];
  ticketStatusID?: number[];
  authorityID?: string[];
  streetID?: number[];
  CN?: string;
  fromCN?: string;
  toCN?: string;
  seriesNumber?: number;
  inspectorName?: string;
  ticketTypeID?: number[];
  //TODO
  //סטטוס דואר
  //סטטוס משפטי
  constructor(filters: InterfaceFilter) {
    this.violationDate = filters.violationDate;
    this.ticketTypeName = filters.ticketTypeName;
    this.violationID = filters.violationID;
    this.violationIDs = filters.violationIDs;
    this.ticketSourceID = filters.ticketSourceID;
    this.stageID = filters.stageID;
    this.ticketStatusID = filters.ticketStatusID;
    this.authorityID = filters.authorityID;
    this.CN = filters.CN;
    this.seriesNumber = filters.seriesNumber;
    this.streetID = filters.streetID;
    this.inspectorName = filters.inspectorName;
    this.fromCN = filters.fromCN;
    this.toCN = filters.toCN;
    this.ticketTypeID = filters.ticketTypeID;
  }
}
export class ViolationDetailsFilter {
  authorityID?: string[];
  authorityStreetID?: number[];
  // streetID?: number[];
  houseNumber?: number;
  fromHouseNumber?: number;
  toHouseNumber?: number;
  areaID?: number[];
  time?: Date;
  fromTime?: Date;
  toTime?: Date;
  vehicleNumber?: any;
  manufacturerID?: number[];
  violationIDs?: string[];
  ticketTypeID?: number[];
  ticketNumber?: string;
  chipNumber?: number;
  isTicketsChecked?: boolean;
  isWarningTicketsChecked?: boolean;

  constructor(args: ViolationDetailsFilter) {
    this.authorityID = args?.authorityID;
    this.authorityStreetID = args?.authorityStreetID;
    // this.streetID = args.streetID;
    this.houseNumber = args.houseNumber;
    this.fromHouseNumber = args.fromHouseNumber;
    this.toHouseNumber = args.toHouseNumber;
    this.areaID = args.areaID;
    this.time = args.time;
    this.fromTime = args.fromTime;
    this.toTime = args.toTime;
    this.vehicleNumber = args.vehicleNumber;
    this.manufacturerID = args.manufacturerID;
    this.violationIDs = args.violationIDs;
    this.ticketTypeID = args.ticketTypeID;
    this.ticketNumber = args.ticketNumber;
    this.chipNumber = args.chipNumber;
    this.isTicketsChecked = args.isTicketsChecked;
    this.isWarningTicketsChecked = args.isWarningTicketsChecked;
  }
}

export class OwnerDetailsFilter {
  firstName?: string;
  lastName?: string;
  cityID?: number[];
  cityStreetID?: number[];
  // streetID?: number[];
  NID?: string;
  isPaspportChecked?: boolean;
  passportID?: string;
  isCNChecked?: boolean;
  CN?: string;
  authorityID?: string[];
  constructor(args: OwnerDetailsFilter) {
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.cityID = args.cityID;
    this.cityStreetID = args.cityStreetID;
    // this.streetID = args.streetID;
    this.NID = args.NID;
    this.isPaspportChecked = args.isPaspportChecked;
    this.passportID = args.passportID;
    this.isCNChecked = args.isCNChecked;
    this.CN = args.CN;
    this.authorityID = args.authorityID;
  }
}

export class SourceDetailsFilter {
  ticketSourceID?: number[];
  isFromReportChecked?: boolean;
  isParkingPermitChecked?: boolean;
  isDisablePermitChecked?: boolean;
  constructor(args: SourceDetailsFilter) {
    this.ticketSourceID = args.ticketSourceID;
    this.isFromReportChecked = args.isFromReportChecked;
    this.isParkingPermitChecked = args.isParkingPermitChecked;
    this.isDisablePermitChecked = args.isDisablePermitChecked;
  }
}

export class ActionsFilter {
  isAppealChecked?: boolean;
  isTriedRequestChecked?: boolean;
  isTransferRequestChecked?: boolean;
  statusID?: number[];
  actionID?: number[];
  stageID?: number[];

  constructor(args: ActionsFilter) {
    this.isAppealChecked = args.isAppealChecked;
    this.isTriedRequestChecked = args.isTriedRequestChecked;
    this.isTransferRequestChecked = args.isTransferRequestChecked;
    this.statusID = args.statusID;
    this.actionID = args.actionID;
    this.stageID = args.stageID;
  }
}

export class OtherFilter {
  fromPaymentBalance?: number;
  toPaymentBalance?: number;
  fromPaymentLastDate?: Date;
  toPaymentLastDate?: Date;
  mainTicket?: number;
  RCRR?: number;

  constructor(args: OtherFilter) {
    this.fromPaymentBalance = args.fromPaymentBalance;
    this.toPaymentBalance = args.toPaymentBalance;
    this.fromPaymentLastDate = args.fromPaymentLastDate;
    this.toPaymentLastDate = args.toPaymentLastDate;
    this.mainTicket = args.mainTicket;
    this.RCRR = args.RCRR;
  }
}

export class TicketTabs {
  public static TicketTabs: AdvancedForm = {
    tabs: [
      {
        name: 'violationDetailsFilter',
        displayName: 'פרטי עבירה',
        rows: [
          {
            group: [
              {
                name: 'authorityID',
                displayName: 'רשות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getAuthorities',
                },
              },
              {
                name: 'authorityStreetID',
                displayName: 'רחוב העבירה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
              {
                name: 'houseNumber',
                displayName: 'מספר בית',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'fromHouseNumber',
                displayName: 'מ-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'toHouseNumber',
                displayName: 'עד',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'areaID',
                displayName: 'אזור עבודה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
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
            ],
          },
          {
            group: [
              {
                name: 'time',
                displayName: 'שעה',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'fromTime',
                displayName: 'מ-',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'toTime',
                displayName: 'עד',
                type: FieldTypeEnum.DateTime,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'vehicleNumber',
                displayName: 'מספר רכב',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'manufacturerID',
                displayName: 'יצרן רכב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getVehicleLookups', //vehicleManufacturers
                  objName: 'vehicleManufacturers',
                },
              },
              {
                name: 'violationIDs',
                displayName: 'סעיף ותיאור עבירה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                bindLabelKeys: ['section', 'description'],
                dataFunction: {
                  name: 'getViolationDetailsList',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'ticketTypeID',
                displayName: 'סוג דו"ח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketTypes
                  objName: 'ticketTypes',
                },
              },
              {
                name: 'chipNumber',
                displayName: 'מספר שבב',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'isTicketsChecked',
                displayName: 'דוחות',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'isWarningTicketsChecked',
                displayName: 'דוחות התראה',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
      {
        name: 'ownerDetailsFilter',
        displayName: 'פרטי חייב',
        rows: [
          {
            group: [
              {
                name: 'firstName',
                displayName: 'שם פרטי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'lastName',
                displayName: 'שם משפחה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'cityID',
                displayName: 'עיר',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getCities',
                },
              },
              {
                name: 'cityStreetID',
                displayName: 'רחוב העבירה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'cityID',
                      paramName: 'cityIDs',
                    },
                  ],
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'NID',
                displayName: 'תעודת זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'isPaspportChecked',
                displayName: 'בעל דרכון',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'passportID',
                displayName: 'מספר דרכון',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'isCNChecked',
                displayName: 'חברה',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'CN',
                displayName: 'ח.פ/חברה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
      {
        name: 'sourceDetailsFilter',
        displayName: 'מסופון',
        rows: [
          {
            group: [
              {
                name: 'ticketSourceID',
                displayName: 'מקור דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketResources
                  objName: 'ticketResources',
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'isFromReportChecked',
                displayName: 'הסבה מריפורט',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'isParkingPermitChecked',
                displayName: 'רכב תו דייר',
                length: FieldLengthEnum.Medium,
                type: FieldTypeEnum.Checkbox,
              },
              {
                name: 'isDisablePermitChecked',
                displayName: 'רכב נכה',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
      {
        name: 'actionsFilter',
        displayName: 'פעולה/סטטוס',
        rows: [
          {
            group: [
              {
                name: 'statusID',
                displayName: 'סטטוס דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketStatuses
                  objName: 'ticketStatuses',
                },
              },
              {
                name: 'actionID',
                displayName: 'פעולה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketSubStages
                  objName: 'ticketSubStages',
                },
              },
              {
                name: 'stageID',
                displayName: 'שלב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketStages
                  objName: 'ticketStages',
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'isAppealChecked',
                displayName: 'ערעור',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Short,
              },
              {
                name: 'isTriedRequestChecked',
                displayName: 'בקשה להישפט',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'isTransferRequestChecked',
                displayName: 'בקשת הסבה',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
      {
        name: 'otherFilter',
        displayName: 'אחר',
        rows: [
          {
            group: [
              {
                name: 'fromPaymentLastDate',
                displayName: 'תאריך פירעון מ-',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'toPaymentLastDate',
                displayName: 'עד',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'fromPaymentBalance',
                displayName: 'יתרה מ-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'toPaymentBalance',
                displayName: 'עד',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'mainTicket',
                displayName: 'דו"ח מוביל',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'RCRR',
                displayName: 'מספר RR/RC',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };
}

export class TicketOwnerAddressesTabs {
  public static TicketOwnerAddressesTabs: AdvancedForm = {
    tabs: [
      {
        name: 'homeAddress',
        displayName: 'כתובת מגורים',
        rows: [
          {
            group: [
              {
                name: 'homeAddressCityID',
                displayName: 'עיר',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getCities',
                },
              },
              {
                name: 'homeAddressStreetID',
                displayName: 'רחוב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'homeAddressCityID',
                      paramName: 'cityIDs',
                    },
                  ],
                },
              },
              {
                name: 'houseNumber',
                displayName: 'מספר בית',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.HOUSE_NUMBER_PATTERN,
              },
              {
                name: 'apartment',
                displayName: 'דירה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.APARTMENT_PATTERN,
              },
              {
                name: 'entrance',
                displayName: 'כניסה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.ENTRANCE_PATTERN,
              },
              {
                name: 'postalCode',
                displayName: 'מיקוד',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.POSTAL_CODE_PATTERN,
              },
              {
                name: 'mailbox',
                displayName: 'תא דואר',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.MAILBOX_PATTERN,
              },
            ],
          },
        ],
      },
      {
        name: 'postalAddress',
        displayName: 'כתובת לשליחת דואר',
        rows: [
          {
            group: [
              {
                name: 'postalAddressCityID',
                displayName: 'עיר',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getCities',
                },
              },
              {
                name: 'postalAddressStreetID',
                displayName: 'רחוב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'postalAddressCityID',
                      paramName: 'cityIDs',
                    },
                  ],
                },
              },
              {
                name: 'houseNumber',
                displayName: 'מספר בית',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.HOUSE_NUMBER_PATTERN,
              },
              {
                name: 'apartment',
                displayName: 'דירה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.APARTMENT_PATTERN,
              },
              {
                name: 'entrance',
                displayName: 'כניסה',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.ENTRANCE_PATTERN,
              },
              {
                name: 'postalCode',
                displayName: 'מיקוד',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.POSTAL_CODE_PATTERN,
              },
              {
                name: 'mailbox',
                displayName: 'תא דואר',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
                validationPattern: Patterns.MAILBOX_PATTERN,
              },
            ],
          },
        ],
      },
    ],
  };
}
export class MinistryOfTransportTabs {
  public static MinistryOfTransportTabs: AdvancedForm = {
    tabs: [
      {
        name: 'interfaceFilter',
        displayName: 'חיפוש מתקדם',
        rows: [
          {
            group: [
              {
                name: 'violationDate',
                displayName: 'תאריך עבירה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },

              {
                name: 'seriesNumber',
                displayName: 'סדרת דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketSeries',
                },
              },
              //TODO:
              {
                name: 'violationIDs',
                displayName: 'סעיף עבירה ',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                bindLabelKeys: ['section', 'description'],
                dataFunction: {
                  name: 'getViolationDetailsList',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },

              {
                name: 'violationIDs',
                displayName: 'סוגי עבירות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getViolationTypesList',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityID',
                    },
                  ],
                },
              },
              {
                name: 'ticketSourceID',
                displayName: ' מקור דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketResources',
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'stageID',
                displayName: 'שלב הדוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups', //ticketStages
                  objName: 'ticketStages',
                },
              },

              {
                name: 'inspectorName',
                displayName: 'שם הפקח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                // bindLabelKeys: ['inspectorID', 'inspectorName'],
                dataFunction: {
                  name: 'getInspectors',
                  // extraParams: [
                  //   {
                  //     connectedField: 'authorityID',
                  //     paramName: 'authorityIDs',
                  //   },
                  // ],
                },
              },
              {
                name: 'authorityID',
                displayName: 'רשות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getAuthorities',
                },
              },
              {
                name: 'streetID',
                displayName: 'רחוב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
            ],
          },

          {
            group: [
              {
                name: 'CN',
                displayName: 'ח.פ',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'fromCN',
                displayName: 'מ-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'toCN',
                displayName: 'עד-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };
}

export class MinistryOfInteriorTabs {
  public static MinistryOfInteriorTabs: AdvancedForm = {
    tabs: [
      {
        name: 'interfaceFilter',
        displayName: 'חיפוש מתקדם',
        rows: [
          {
            group: [
              {
                name: 'violationDate',
                displayName: 'תאריך עבירה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'ticketTypeID',
                displayName: 'סוג דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketTypes',
                },
              },
              {
                name: 'seriesNumber',
                displayName: 'סדרת דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketSeries',
                },
              },

              {
                name: 'violationIDs',
                displayName: 'סעיף עברה ',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                bindLabelKeys: ['section', 'description'],
                dataFunction: {
                  name: 'getViolationDetailsList',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },

              {
                name: 'violationIDs',
                displayName: 'סוגי עבירות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                // bindLabelKeys: ['authorityID'],
                dataFunction: {
                  name: 'getViolationTypesList',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityID',
                    },
                  ],
                },
              },
              {
                name: 'ticketSourceID',
                displayName: ' מקור דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketResources',
                },
              },
            ],
          },
          {
            group: [
              //TODO:
              {
                name: 'stageID',
                displayName: 'סטטוס דואר',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'stageID',
                displayName: 'שלב הדוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketStages',
                },
              },
              //TODO:
              {
                name: 'stageID',
                displayName: 'סטטוס משפטי',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'inspectorName',
                displayName: 'שם הפקח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,

                dataFunction: {
                  name: 'getInspectors',
                  // extraParams: [
                  //   {
                  //     connectedField: 'authorityID',
                  //     paramName: 'authorityIDs',
                  //   },
                  // ],
                },
              },
              {
                name: 'authorityID',
                displayName: 'רשות',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getAuthorities',
                },
              },
              {
                name: 'streetID',
                displayName: 'רחוב',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getStreets',
                  extraParams: [
                    {
                      connectedField: 'authorityID',
                      paramName: 'authorityIDs',
                    },
                  ],
                },
              },
            ],
          },

          {
            group: [
              {
                name: 'CN',
                displayName: 'ח.פ',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'fromCN',
                displayName: 'מ-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'toCN',
                displayName: 'עד-',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };
}
