import {TicketNew} from "../types/ticket";
import {ParkingPermitType} from "../types/parkingPermit/parkingPermitType";


export function isTicketNewArray(records: any): records is TicketNew[] {
  return Array.isArray(records) && records.every(rec => rec?.ticketNumber !== undefined);
}

export function isParkingPermitType(records: any): records is ParkingPermitType[] {
  return Array.isArray(records) && records.every(rec => rec?.parkingPermitID !== undefined);
}

