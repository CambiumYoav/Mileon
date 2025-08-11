import { Address } from "./address"
import { PaymentHistory } from "./paymentHistory"
import { RemarkHistory } from "./remarkHistory"
import { TicketInternalMessage } from "./ticketInternalMessage"
import { Vehicle } from "./vehicle"
import { Violation } from "./violation"
import { File } from "./file"

export class TicketViolationDetails{
    ticketNumber: string
    statusID: number
    ticketRecipient: string
    violationTime: Date
    violation: Violation
    vehicle: Vehicle
    address: Address
    mainTicketID: string
    inspectorName: string
    ticketResourceID: number
    inspectorEnforcementActionID: number
    ticketInternalMessages: TicketInternalMessage[]
    inspectorResevedRemarks: string[]
    fineAmount: number
    paymentBalance: number
    paymentLastDate: Date
    paymentHistory: PaymentHistory[]
    inspectorDescription: string
    violationFiles: File[];

    constructor(
        args: TicketViolationDetails
      ) {
        this.ticketNumber = args.ticketNumber;
        this.statusID = args.statusID;
        this.ticketRecipient = args.ticketRecipient;
        this.violationTime = args.violationTime;
        this.violation = args.violation;
        this.vehicle = args.vehicle;
        this.address = args.address;
        this.mainTicketID = args.mainTicketID;
        this.inspectorName = args.inspectorName;
        this.ticketResourceID = args.ticketResourceID;
        this.inspectorEnforcementActionID = args.inspectorEnforcementActionID;
        this.ticketInternalMessages = args.ticketInternalMessages;
        this.inspectorResevedRemarks = args.inspectorResevedRemarks;
        this.fineAmount = args.fineAmount;
        this.paymentBalance = args.paymentBalance;
        this.paymentLastDate = args.paymentLastDate;
        this.paymentHistory = args.paymentHistory;
        this.inspectorDescription = args.inspectorDescription;
        this.violationFiles = args.violationFiles.map((file) => new File(file));
      }
}
