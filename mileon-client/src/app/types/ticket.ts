import { Citizen } from "./citizen";
import {ListCountResult} from "./listCountResult";

export class Ticket {
  authorityName!: string;
  name!: string;
  nid!: string;
  citizenID!: string;
  mainPhone?: string;
  email?: string;
  ticketGivingDate!: Date;
  ticketID!: string;
  ticketNumber!: string;
  ticketStatusID!: number;
  ticketSubStatusID!: number;
  ticketTypeID!: number;
  violationDate!: Date;
  fineAmount!: number;
  ticketStageID!: number;
  vehicleNumber?: number;
  isChecked?: boolean;
}

export class TicketNew {
  authorityName!: string;    
  authorityID?: number;
  citizenID!: string;
  name!: string;
  nid!: string;
  email!: string;
  mainPhone!: string;
  ticketID!: string;
  ticketNumber!: string;
  ticketStatusID!: number;
  ticketSubStatusID!: number;
  ticketStatusName!: string;
  ticketTypeID!: number;
  ticketTypeName!: string;
  fineAmount!: number;
  paymentBalance!: number;
  ticketStageID!: number;
  vehicleNumber?: number;
  isChecked?: boolean;
  cn?: string;
  lastUpdatedByUserName!: string;
  ticketGivingDate!: string | Date;
  ticketStageName!: string;
  violationDate!: string | Date;
  AdditionalReportsAmount?: number;
  Owner?: Citizen;
  passportID?: string;



  constructor(args?: any) {
    if (args && typeof args === 'object') {
      Object.assign(this, args);
    }
    if(typeof  this.violationDate === 'string')
       this.ticketGivingDate =new Date(Date.parse(this.violationDate));
    }

}

export type ConnectedTicketsPayload = {
  ticketID: string;
  currentPage: number;
}



