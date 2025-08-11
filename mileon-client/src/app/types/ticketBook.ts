export interface TicketBook {
  bookID: string;
  bookNumber: number;
  bookNumberEnd: number | null;
  ticketCount: number;
  seriesNumber: number;
  authorityID: string | null;
  creationDate: string;
  ticketTypeID: number;
  ticketBookStatusID: number;
  inspectorID: string;
  issuedDate: string;
  inUse: boolean;
  ticketOpenCount: number;
  ticketClosedCount: number;
  fromTicketNumbr: string;
  toTicketNumbr: string;
  creatorUserName: string;
  inspectorName: string;
  ticketTypeName: string;
}
