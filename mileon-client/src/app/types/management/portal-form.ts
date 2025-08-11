export class portalManagementForm {
  allowParkingTicketsPay: boolean;
  allowParkingTicketsWatch: boolean;
  allowParkingTicketsAppealRequest: boolean;
  allowParkingTicketsIdentificationRequest: boolean;
  allowParkingTicketsRequestToBeTried: boolean;
  allowGeneralTicketsPay: boolean;
  allowGeneralTicketsWatch: boolean;
  allowGeneralTicketsAppealRequest: boolean;
  allowGeneralTicketsIdentificationRequest: boolean;
  allowGeneralTicketsRequestToBeTried: boolean;
  allowParkingPermit: boolean;
  allowParkingPermitExpirationCheck: boolean;
  allowParkingPermitAddDocuments: boolean;
  allowTrafficSignCommittee: boolean;
  allowTrafficSignCommitteeStatus: boolean;
  allowCarJunk: boolean;

  constructor(args: portalManagementForm) {
    this.allowParkingTicketsPay = args.allowParkingTicketsPay;
    this.allowParkingTicketsWatch = args.allowParkingTicketsWatch;
    this.allowParkingTicketsAppealRequest =
      args.allowParkingTicketsAppealRequest;
    this.allowParkingTicketsIdentificationRequest =
      args.allowParkingTicketsIdentificationRequest;
    this.allowParkingTicketsRequestToBeTried =
      args.allowParkingTicketsRequestToBeTried;
    this.allowGeneralTicketsPay = args.allowGeneralTicketsPay;
    this.allowGeneralTicketsWatch = args.allowGeneralTicketsWatch;
    this.allowGeneralTicketsAppealRequest =
      args.allowGeneralTicketsAppealRequest;
    this.allowGeneralTicketsIdentificationRequest =
      args.allowGeneralTicketsIdentificationRequest;
    this.allowParkingPermit = args.allowParkingPermit;
    this.allowParkingPermitExpirationCheck =
      args.allowParkingPermitExpirationCheck;
    this.allowParkingPermitAddDocuments = args.allowParkingPermitAddDocuments;
    this.allowParkingPermitExpirationCheck =
      args.allowParkingPermitExpirationCheck;
    this.allowTrafficSignCommittee = args.allowTrafficSignCommittee;
    this.allowTrafficSignCommitteeStatus = args.allowTrafficSignCommitteeStatus;
    this.allowCarJunk = args.allowCarJunk;
  }
}

export const portalFormValidation = [];
