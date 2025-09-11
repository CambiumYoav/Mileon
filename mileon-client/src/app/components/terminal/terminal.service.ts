import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { LookupNewService } from '../../services/lookup-new.service';
import { SelectParams } from '../../types/advanced-search/select-option.model';
import { TicketBookAction } from '../../types/enum/TicketBookActionEnum';
import { InspectorTask } from '../../types/inspectorTask';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  TicketBookContoller = 'TicketBooks';
  InspectorsContoller = 'Inspectors';
  TerminalController = 'terminal/Terminal';
  constructor(
    private httpService: HttpService,
    private lookupNewService: LookupNewService
  ) {}

  //-----------------Ticketbooks---------------//
  getTicketBooks(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.TicketBookContoller}`,
      body
    );
    return lastValueFrom(res);
  }

  createTicketBook(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.TicketBookContoller}/Create`,
      body
    );
    return lastValueFrom(res);
  }

  updateTicketBookByAction(body = {}, action: TicketBookAction) {
    const res = this.httpService.postRequest(
      `${this.TicketBookContoller}/${action}`,
      body
    );

    return lastValueFrom(res);
  }

  getTicketBookById(bookID: string) {
    const res = this.httpService.getRequest(
      `${this.TicketBookContoller}/${bookID}`
    );

    return lastValueFrom(res);
  }

  deleteTicketBook(bookID: string) {
    const res = this.httpService.postRequest(
      `${this.TicketBookContoller}/DeleteTicketBooks?ticketBookIDs=${bookID}`,
      {}
    );

    return lastValueFrom(res);
  }

  exportTicketBooks(body = {}, bookID?: string, isAssigned?: boolean) {
    const queryParams = new URLSearchParams();

    if (bookID) {
      queryParams.append('bookID', bookID);
    }

    if (isAssigned !== undefined) {
      queryParams.append('isAssigned', String(isAssigned)); // Convert boolean to string
    }

    // Construct the full request URL with query params
    const url = `${this.TicketBookContoller}/export${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    const res = this.httpService.postRequestForBlob(url, body);
    return lastValueFrom(res);
  }

  getAssignedTickets(bookID: string) {
    const res = this.httpService.getRequest(
      `${this.TicketBookContoller}/AssignedTickets/${bookID}`
    );

    return lastValueFrom(res);
  }

  //-----------------Inspectors---------------//
  getInspectorsDashboard(authorityId: string, inspectorId?: string) {
    const queryParams = new URLSearchParams();

    if (inspectorId) {
      queryParams.append('inspectorId', inspectorId);
    }

    const url = `${
      this.InspectorsContoller
    }/GetDashboard?authorityId=${authorityId}${
      queryParams.toString() ? '&' + queryParams.toString() : ''
    }`;
    const res = this.httpService.getRequest(url);
    return lastValueFrom(res);
  }

  // getInspectorsDashboardByIds(body = {}, ticketType?: string) {
  //   const queryParams = new URLSearchParams();

  //   if (ticketType) {
  //     queryParams.append('ticketType', ticketType);
  //   }

  //   const url = `${
  //     this.InspectorsContoller
  //   }/GetDashboard?ticketType=${ticketType}${
  //     queryParams.toString() ? '&' + queryParams.toString() : ''
  //   }`;

  //   const res = this.httpService.postRequest(url, body);
  //   return lastValueFrom(res);
  //   // const res = this.httpService.postRequest(
  //   //   `${this.InspectorsContoller}/GetDashboardForInspectors`,
  //   //   body
  //   // );
  //   return lastValueFrom(res);
  // }

  getInspectorsDashboardByIds(body = {}) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetDashboardForInspectors`,
      body
    );
    return lastValueFrom(res);
  }
  getAllInspectors(body: any) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetInspectors`,
      body
    );
    return lastValueFrom(res);
  }

  getInspectorsTasks(body: any) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetTasks`,
      body
    );
    return lastValueFrom(res);
  }

  createInspectorTask(body: InspectorTask) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/CreateTask`,
      body
    );
    return lastValueFrom(res);
  }

  //-----------------Settings---------------//
  createOrUpdateSettings(body = {}, authorityId: string, catergoryId: string) {
    const res = this.httpService.postRequest(
      `${this.TerminalController}/CreateOrUpdateSettings?authorityID=${authorityId}&categoryID=${catergoryId}`,
      body
    );
    return lastValueFrom(res);
  }

  createOrUpdateIconsSettings(
    body = {},
    authorityId: string,
    catergoryId: string
  ) {
    const res = this.httpService.postRequest(
      `${this.TerminalController}/CreateIconsSettingsForAuthority?authorityID=${authorityId}&categoryID=${catergoryId}`,
      body
    );
    return lastValueFrom(res);
  }
  getSettingsCategories() {
    const res = this.httpService.getRequest(
      `${this.TerminalController}/GetCategories`
    );
    return lastValueFrom(res);
  }

  getSettingsByCategory(catergoryId: string, authorityId: string) {
    const res = this.httpService.getRequest(
      `${this.TerminalController}/GetSettingsByCategory/${catergoryId}?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  getIconsSettings(authorityId: string) {
    const res = this.httpService.getRequest(
      `${this.TerminalController}/GetIconsSettings?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  //-----------------Statics---------------//
  getReportDistributionStatics(body: any) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetReportDistributionStatics`,
      body
    );
    return lastValueFrom(res);
  }

  getReportYearlyStatics(body = {}) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetReportYearlyStatics`,
      body
    );
    return lastValueFrom(res);
  }
  getReportViolationStatics(body = {}) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetReportViolationStatics`,
      body
    );
    return lastValueFrom(res);
  }

  getReportByInspectorStatics(body = {}) {
    const res = this.httpService.postRequest(
      `${this.InspectorsContoller}/GetReportByInspectorStatics`,
      body
    );
    return lastValueFrom(res);
  }

  //-----------------Lookup---------------//
  getInspectors(filter?: SelectParams) {
    return this.lookupNewService.getInspectors(filter);
  }
}
