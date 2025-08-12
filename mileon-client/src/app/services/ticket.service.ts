import { HttpClient } from '@angular/common/http';
import { EventEmitter, inject, Injectable, Output } from '@angular/core';
import { Observable, Subject, map } from 'rxjs';
import { CallSummary } from '../types/callSummary';
import { OwnerFilter } from '../types/filters/ticket/ownerFilter';
import { TicketFilterOptions } from '../types/filters/ticket/ticketFilterOptions';
import { ListCountResult } from '../types/listCountResult';
import { ReservedSummary } from '../types/reservedSummary';
import { Ticket, TicketNew } from '../types/ticket';
import { TicketDetails } from '../types/ticketDetails';
import { TicketHistory } from '../types/ticketHistory';
import {
  FinanacialTransactions4Ticket,
  Tickets4FinanacialTransactions,
} from '../types/ticketPaymentDetails';
import { TicketViolationDetails } from '../types/ticketViolationDetails';
import { TimeLineStage } from '../types/timeLineStage';
import { BaseService } from './base.service';
import { HttpService } from './http.service';
import { Citizen } from '../types/citizen';
import { ErrorSuccessMessages } from '../types/enum/error-success-messages';
import { ApiPaths } from '../constants/api-path.const';

@Injectable({
  providedIn: 'root',
})
export class TicketService {
  configUrl: string;
  apiController = 'Tickets';
  @Output() afterGetTicketDetails = new EventEmitter();
  @Output() navigateSideMenu = new EventEmitter();
  _goToTabNumber = new Subject<number>();
  private baseService = inject(BaseService);
  private http = inject(HttpClient);
  private httpService = inject(HttpService);
  constructor() {
    this.configUrl = this.baseService.baseUrl + '/Tickets';
  }

  getTickets(
    filter?: TicketFilterOptions
  ): Observable<ListCountResult<Ticket>> {
    const url = `${this.configUrl}/${ApiPaths.Tickets.GETALL}`;
    return this.http.post<ListCountResult<Ticket>>(
      url,
      filter,
      this.baseService.httpOptions
    );
  }

  // WHY THIS FUNCTION IS NOT IN SERVICE OR UTILS!!? -- removed it not using
  // TODO: Move to utils or service!
  // bad practice to have this here
  convertDateToString(d: Date): string {
    const date = new Date(d);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }

  getViewTicketHistory(userID: string): Observable<Ticket[]> {
    return this.httpService.getRequest(
      `${this.apiController}/GetViewTicketHistory?userID=${userID}`
    );
  }

  getTicketDetails(ticketId: string): Observable<TicketDetails> {
    return this.httpService
      .getRequest(`${this.apiController}/${ticketId}/Details`)
      .pipe(map((d) => new TicketDetails(d)));
  }

  getReserves(): Observable<ReservedSummary[]> {
    return this.httpService.getRequest(`${this.apiController}/ReservedSummary`);
  }

  getCallSummaries(ticketId: string): Observable<CallSummary[]> {
    return this.httpService.getRequest(
      `${this.apiController}/${ticketId}/CallSummary`
    );
  }

  addCallSummary(callSummary: CallSummary) {
    return this.httpService.postRequest(
      `${this.apiController}/CallSummary`,
      callSummary,
      ErrorSuccessMessages.SUCCESS
    );
  }

  addViewTicketHistory(userId: string, ticketID: string) {
    return this.httpService.postRequest(
      `${this.apiController}/AddViewTicketHistory`,
      { UserID: userId, TicketID: ticketID }
    );
  }

  getTicketViolationDetails(
    ticketId: string
  ): Observable<TicketViolationDetails> {
    return this.httpService
      .getRequest(`${this.apiController}/${ticketId}/Violation`)
      .pipe(map((d) => new TicketViolationDetails(d)));
  }

  getTimeline(ticketId: string): Observable<TimeLineStage[]> {
    return this.httpService.getRequest(
      `${this.apiController}/${ticketId}/Timeline`
    );
  }

  getFiles() {
    return [
      {
        src: 'car1.PNG',
        title: 'רכב בחניה לא חוקית',
        date: new Date(),
      },
      {
        src: 'car2.PNG',
        title: 'רכב בחניה לא חוקית',
        date: new Date(),
      },
      {
        src: 'car3.PNG',
        title: 'רכב בחניה לא חוקית',
        date: new Date(),
      },
    ];
  }

  getTicketsByOwnerDetails(
    ownerFilter: OwnerFilter
  ): Observable<Tickets4FinanacialTransactions> {
    // didn't find in the front where this function is used
    return this.httpService.postRequest(
      `${this.apiController}/GetTicketsWithFinancialSummary`,
      ownerFilter
    );
  }

  getTicketHistories(
    ticketNumber: string
  ): Observable<ListCountResult<TicketHistory>> {
    //the response in both ways is the same, array length is 0
    return this.httpService.getRequest(
      `${this.apiController}/${ticketNumber}/History`
    );
  }

  getFinancialTransactions(
    ticketNumber: string
  ): Observable<FinanacialTransactions4Ticket> {
    // const url = `${this.configUrl}/${ticketNumber}/FinancialTransactions`;
    // return this.http.get<FinanacialTransactions4Ticket>(
    //   url,
    //   this.baseService.httpOptions
    // );
    return this.httpService.getRequest(
      `${this.apiController}/${ticketNumber}/FinancialTransactions`
    );
  }

  updateTicketOwner(ticketID: string, citizen: Citizen): Observable<Citizen> {
    return this.httpService.postRequest(
      `${this.apiController}/${ticketID}/Citizen`,
      citizen,
      ErrorSuccessMessages.SUCCESS
    );
  }

  setTabNumber(tabNumber: number): void {
    this._goToTabNumber.next(tabNumber);
  }
}
