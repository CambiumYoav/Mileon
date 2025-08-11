import {
  AdvancedForm,
  FieldLengthEnum,
  FieldTypeEnum,
} from '../../advanced-search/form-tab.model';
import { FilterOptions } from '../filterOptions';

export class LegalRequestsFilterOptions extends FilterOptions {
  legalRequestFilter: LegalRequestFilters;

  constructor(options: LegalRequestsFilterOptions) {
    super(options);
    this.legalRequestFilter =
      options.legalRequestFilter || new LegalRequestFilters({});
  }
}

export class LegalRequestFilters {
  startDate?: Date;
  endDate?: Date;
  NID?: string;
  firstName?: string;
  lastName?: string;
  isOverseasResident?: boolean;
  vehicleNumber?: string;
  ticketNumber?: string;
  ticketTypeIDs?: number[];
  ticketStatusID?: number;
  requestTypeID?: number;
  requestSourceID?: number;
  isConfirmed?: boolean;
  requestStatusIDs?: number[];
  creationDate?: Date;
  creationFromDate?: Date;
  creationToDate?: Date;
  lastAppealRequestDate?: Date;
  lastAppealRequestFromDate?: Date;
  lastAppealRequestToDate?: Date;
  authorityID?: string;

  constructor(filters: LegalRequestFilters) {
    this.NID = filters.NID;
    this.firstName = filters.firstName;
    this.lastName = filters.lastName;
    this.isOverseasResident = filters.isOverseasResident;
    this.vehicleNumber = filters.vehicleNumber;
    this.ticketNumber = filters.ticketNumber;
    this.ticketTypeIDs = filters.ticketTypeIDs;
    this.ticketStatusID = filters.ticketStatusID;
    this.requestTypeID = filters.requestTypeID;
    this.requestSourceID = filters.requestSourceID;
    this.isConfirmed = filters.isConfirmed;
    this.requestStatusIDs = filters.requestStatusIDs;
    this.creationDate = filters.creationDate;
    this.creationFromDate = filters.creationFromDate;
    this.creationToDate = filters.creationToDate;
    this.lastAppealRequestDate = filters.lastAppealRequestDate;
    this.lastAppealRequestFromDate = filters.lastAppealRequestFromDate;
    this.lastAppealRequestToDate = filters.lastAppealRequestToDate;
    this.authorityID = filters.authorityID;
  }
}

export class LegalRequestsTabs {
  public static LegalRequestsTabs: AdvancedForm = {
    tabs: [
      {
        name: 'legalRequestFilter',
        displayName: 'חיפוש מתקדם',
        rows: [
          {
            group: [
              {
                name: 'NID',
                displayName: 'תעודת זהות',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
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
                name: 'isOverseasResident',
                displayName: 'תושב חוץ',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
          {
            group: [
              {
                name: 'vehicleNumber',
                displayName: 'מספר רישוי',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'ticketNumber',
                displayName: 'מספר דוח',
                type: FieldTypeEnum.Text,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'ticketTypeIDs',
                displayName: 'סוג דו"ח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketTypes',
                },
              },
              {
                name: 'ticketStatusID',
                displayName: 'סטטוס דוח',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getTicketLookups',
                  objName: 'ticketStatuses',
                },
              },
            ],
          },
          {
            group: [
              {
                name: 'requestTypeID',
                displayName: 'סוג בקשה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getLegalRequestsLookups',
                  objName: 'legalRequestsTypes',
                },
              },
              {
                name: 'requestStatusIDs',
                displayName: 'סטטוס בקשה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getLegalRequestsLookups',
                  objName: 'legalRequestsStatuses',
                },
              },
              {
                name: 'requestSourceID',
                displayName: 'אופן ההגשה',
                type: FieldTypeEnum.Select,
                length: FieldLengthEnum.Medium,
                dataFunction: {
                  name: 'getLegalRequestsLookups',
                  objName: 'legalRequestsSources',
                },
              },
              {
                name: 'isConfirmed',
                displayName: 'החלטת התובע',
                type: FieldTypeEnum.Checkbox,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
          {
            group: [
              {
                name: 'creationDate',
                displayName: 'תאריך הגשת הבקשה',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'creationFromDate',
                displayName: 'מתאריך',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
              {
                name: 'creationToDate',
                displayName: 'עד תאריך',
                type: FieldTypeEnum.Date,
                length: FieldLengthEnum.Medium,
              },
            ],
          },
        ],
      },
    ],
  };
}
