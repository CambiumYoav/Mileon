import { SortOrder } from '../../enum/sort-order.enum';
import { FilterOptions } from '../filterOptions';

// export class TicketFilterOptions extends FilterOptions {
//     startDate?: Date
//     endDate?: Date
//     violationDetailsFilter?: ViolationDetailsFilter
//     ownerDetailsFilter?: OwnerDetailsFilter
//     sourceDetailsFilter?: SourceDetailsFilter
//     actionsFilter?: ActionsFilter
//     otherFilter?: OtherFilter
// }

// export class ViolationDetailsFilter {
//     authorityID?: string[]
//     streetID?: number[]
//     houseNumber?: number
//     fromHouseNumber?: number
//     toHouseNumber?: number
//     areaID?: number[]
//     time?: Date
//     fromTime?: Date
//     toTime?: Date
//     vehicleNumber?:any
//     manufacturerID?: number[]
//     // section?: string[]
//     // description?: string[]

//     violationIDs?: string[]
//     ticketTypeID?: number[]
//     ticketNumber?: string
//     chipNumber?:number
//     isTicketsChecked?: boolean
//     isWarningTicketsChecked?: boolean
// }

// export class OwnerDetailsFilter {
//     firstName?: string
//     lastName?: string
//     cityID?: number[]
//     streetID?: number[]
//     NID?: string
//     isPaspportChecked?: boolean
//     passportID?: string
//     isCNChecked?: boolean
//     CN?: string
//     authorityID?: string[]
// }

// export class SourceDetailsFilter {
//     ticketSourceID?: number[]
//     isFromReportChecked?: boolean
//     isParkingPermitChecked?: boolean
//     isDisablePermitChecked?: boolean
// }

// export class ActionsFilter {
//     isAppealChecked?: boolean
//     isTriedRequestChecked?: boolean
//     isTransferRequestChecked?: boolean
//     statusID?: number[]
//     actionID?: number[]
//     stageID?:number[]
// }

// export class OtherFilter {
//     fromFineAmount?: number
//     toFineAmount?: number
//     fromPaymentLastDate?: Date
//     toPaymentLastDate?: Date
//     mainTicket?: number
//     RCRR?: number
// }

export class TicketFilterOptions extends FilterOptions {
  violationDetailsFilter?: ViolationDetailsFilter;
  ownerDetailsFilter?: OwnerDetailsFilter;
  sourceDetailsFilter?: SourceDetailsFilter;
  actionsFilter?: ActionsFilter;
  otherFilter?: OtherFilter;
  interfaceFilter?: InterfaceFilter;
  ticketBookFilter?: TicketBookFilter;

  constructor(args: TicketFilterOptions) {
    super();
    this.pageSize = args?.pageSize;
    this.startDate = args?.startDate;
    this.endDate = args?.endDate;
    this.searchText = args?.searchText;
    this.violationDetailsFilter =
      args?.violationDetailsFilter || new ViolationDetailsFilter({});
    this.ownerDetailsFilter =
      args?.ownerDetailsFilter || new OwnerDetailsFilter({});
    this.sourceDetailsFilter =
      args?.sourceDetailsFilter || new SourceDetailsFilter({});
    this.actionsFilter = args?.actionsFilter || new ActionsFilter({});
    this.otherFilter = args?.otherFilter || new OtherFilter({});
    this.interfaceFilter = args?.interfaceFilter || new InterfaceFilter({});
    this.ticketBookFilter = args?.ticketBookFilter || new TicketBookFilter({});
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
  //FIXME - After backend fix
  stageID?: number[];
  ticketStatusID?: number[];
  authorityID?: string[];
  streetID?: number[];
  cn?: string;
  fromCN?: string;
  toCN?: string;
  seriesNumber?: number;
  inspectorName?: string;
  InspectorID?: string;
  ticketTypeID?: number[];
  TicketGivingDate?: Date;
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
    this.cn = filters.cn;
    this.seriesNumber = filters.seriesNumber;
    this.streetID = filters.streetID;
    this.inspectorName = filters.inspectorName;
    this.fromCN = filters.fromCN;
    this.toCN = filters.toCN;
    this.ticketTypeID = filters.ticketTypeID;
    this.InspectorID = filters.InspectorID;
    this.TicketGivingDate = filters.TicketGivingDate;
  }
}
export class ViolationDetailsFilter {
  authorityID?: string[];
  streetID?: number[];
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
    this.streetID = args.streetID;
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
  streetID?: number[];
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
    this.streetID = args.streetID;
    this.NID = args.NID;
    this.isPaspportChecked = args.isPaspportChecked;
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
export class TicketBookFilter {
  seriesNumber?: number;
  constructor(args: TicketBookFilter) {
    this.seriesNumber = args.seriesNumber;
  }
}
