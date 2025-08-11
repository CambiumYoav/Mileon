import { Citizen } from './citizen';
import { File } from './file';
import { Vehicle } from './vehicle';

export class TicketDetails {
  citizen: Citizen;
  fineAmount: number;
  paymentBalance: number;
  paymentLastDate: Date;
  ticketGivingDate: Date;
  ticketNumber: string;
  violationFiles: File[];
  ticketTypeID: number;
  violationName?: string;
  vehicle?: Vehicle;
  ticketStatusID: number;
  violationSection?: string;

  constructor(
    args: TicketDetails
  ) {

    this.citizen = new Citizen(args.citizen);
    this.fineAmount = args.fineAmount;
    this.paymentBalance = args.paymentBalance;
    this.paymentLastDate = args.paymentLastDate;
    this.ticketGivingDate = args.ticketGivingDate;
    this.ticketNumber = args.ticketNumber;
    this.violationFiles = args.violationFiles.map((file) => new File(file));
    this.ticketTypeID = args.ticketTypeID;
    this.violationName = args?.violationName;
    this.vehicle = args?.vehicle;
    this.ticketStatusID = args.ticketStatusID;
    this.violationSection = args?.violationSection;
  }
}
