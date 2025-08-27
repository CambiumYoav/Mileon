import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { HttpService } from '../../services/http.service';
import { CallSummary } from '../../types/callSummary';
import { OwnerFilter } from '../../types/filters/ticket/ownerFilter';
import { ListCountResult } from '../../types/listCountResult';
import { ReservedSummary } from '../../types/reservedSummary';
import { Summary } from '../../types/summary.model';
import { ConnectedTicketsPayload, TicketNew } from '../../types/ticket';
import { TicketHistory } from '../../types/ticketHistory';
import {
  FinanacialTransactions4Ticket,
  Tickets4FinanacialTransactions,
} from '../../types/ticketPaymentDetails';
import { TicketViolationDetails } from '../../types/ticketViolationDetails';
import { TimeLineStage } from '../../types/timeLineStage';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  apiController = 'Tickets';

  constructor(private httpService: HttpService, private http: HttpClient) {}

  getTicketById(ticketId: string) {
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketId}/Details`
    );
    return lastValueFrom(res);
  }

  getTickets(body = {}): Promise<ListCountResult<TicketNew>> | null {
    const res = this.httpService.postRequest(
      `${this.apiController}/GetTickets`,
      body
    );
    return lastValueFrom(res);
  }

  getTicketsByTypeAndStatus(type = 2) {
    const res = this.httpService.postRequest(
      `${this.apiController}/GetTicketsByTypeAndStatus`,
      type
    );

    return lastValueFrom(res);
  }

  connectedTicketsByVehicle(
    data: ConnectedTicketsPayload
  ): Promise<ListCountResult<TicketNew>> | null {
    const res = this.httpService.postRequest(
      `${this.apiController}/connectedTicketsByVehicle`,
      data
    );
    return lastValueFrom(res);
  }

  connectedTicketsByIdentity(
    data: ConnectedTicketsPayload
  ): Promise<ListCountResult<TicketNew>> | null {
    const res = this.httpService.postRequest(
      `${this.apiController}/connectedTicketsByIdentity`,
      data
    );
    return lastValueFrom(res);
  }

  createParkingPermit(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/CreateOrUpdate`,
      body
    );
    return lastValueFrom(res);
  }

  getReserves(): Promise<ReservedSummary[]> {
    const res = this.httpService.getRequest(
      `${this.apiController}/ReservedSummary`
    );
    return lastValueFrom(res);
  }

  getCallSummaries(ticketId: string): Promise<CallSummary[]> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketId}/CallSummary`
    );
    return lastValueFrom(res);
  }

  addCallSummary(callSummary: CallSummary) {
    const res = this.httpService.postRequest(
      `${this.apiController}/CallSummary`,
      callSummary
    );
    return lastValueFrom(res);
  }

  getViewTicketHistory(userID: string): Promise<TicketNew[]> {
    const res = this.httpService.getRequestWithParams<TicketNew[]>(
      `${this.apiController}/GetViewTicketHistory`,
      { userID }
    );
    return lastValueFrom(res);
  }

  addViewTicketHistory(userId: string, ticketID: string) {
    const res = this.httpService.postRequest(
      `${this.apiController}/AddViewTicketHistory`,
      { UserID: userId, TicketID: ticketID }
    );
    return lastValueFrom(res);
  }

  getTicketViolationDetails(ticketId: string): Promise<TicketViolationDetails> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketId}/Violation`
    );
    return lastValueFrom(res);
  }

  getTimeline(ticketId: string): Promise<TimeLineStage[]> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketId}/Timeline`
    );
    return lastValueFrom(res);
  }
  getTicketsByOwnerDetails(
    ownerFilter: OwnerFilter
  ): Promise<Tickets4FinanacialTransactions> {
    // didn't find in the front where this function is used
    const res = this.httpService.postRequest(
      `${this.apiController}/GetTicketsWithFinancialSummary`,
      ownerFilter
    );
    return lastValueFrom(res);
  }

  getTicketHistories(
    ticketNumber: string
  ): Promise<ListCountResult<TicketHistory>> {
    //the response in both ways is the same, array length is 0
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketNumber}/History`
    );
    return lastValueFrom(res);
  }

  getFinancialTransactions(
    ticketNumber: string
  ): Promise<FinanacialTransactions4Ticket> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${ticketNumber}/FinancialTransactions`
    );
    return lastValueFrom(res);
  }

  getMainSummary(authorityId: string): Promise<Summary> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/Summary`
    );
    return lastValueFrom(res);
  }

  getBackOfficeMainTable(
    authorityId: string
  ): Promise<ListCountResult<TicketNew>> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/Summary/List`
    );
    return lastValueFrom(res);
  }

  exportDataToExcel(body = {}): Promise<any> {
    const res = this.httpService.postRequestForBlob(
      `${this.apiController}/excel`,
      body
    );

    return lastValueFrom(res);
  }

  // exportDataToExcel(body = {}): Promise<any> {
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json', // Set the content type if necessary
  //   });
  //   const res = this.http.post<any>(
  //     'https://localhost:7047/api/Tickets/excel',
  //     body,
  //     {
  //       responseType: 'blob' as 'json', // Specify the response type as blob
  //     }
  //   );
  //   return lastValueFrom(res);
  //   // .pipe(
  //   //   catchError((error) => {
  //   //     console.error('Download error:', error);
  //   //     return throwError(
  //   //       () => new Error('Download failed, please try again.')
  //   //     );
  //   //   })
  //   // );
  // }
}
