import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { SelectParams } from '../types/advanced-search/select-option.model';
import { FilterOptions } from '../types/filters/filterOptions';
import { ListData, ReturnedData } from '../types/listData';
import { GlobalOptions, Lookup } from '../types/lookup';
import { ViolationDetails } from '../types/violationDetails';
import { HttpService } from './http.service';
import { Utils } from '../utils/utils';
import { Observable } from 'rxjs/internal/Observable';
import { ActionModuleEnum } from '../types/enum/moduleEnum';
import { ReservedComment } from '../types/reservedComment';
import { PermitByEnum } from '../types/enum/permitByEnum';
import { noticeMessageOptionsEnum } from '../types/enum/noticeNessageOptionsEnum';
import { TemplatesTypesEnum } from '../types/enum/templatesTypesEnum';

@Injectable({
  providedIn: 'root',
})
export class LookupNewService {
  apiController: string = 'Lookup';
  ticketLookups!: Lookup;
  
  constructor(private httpService: HttpService) {}

  getAuthorities(filter?: SelectParams): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/Authorities`,
      filter
    );
    return lastValueFrom(res);
  }

  getAuthoritiesNoFilter(): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/Authorities`
    );
    return lastValueFrom(res);
  }

  getAuthoritiesForHeader(filter?: FilterOptions): Promise<any[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/AuthoritiesForHeader?CurrentPage=${filter}&PageSize=10`
    );
    return lastValueFrom(res);
  }
  getStreets(filter?: SelectParams): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/Streets`,
      filter
    );
    return lastValueFrom(res);
  }

  getAreas(filter?: SelectParams): Promise<ReturnedData<number>[]> {
    const res = this.httpService.getRequestWithQueryParams<ListData<number>[]>(
      `${this.apiController}/Areas`,
      filter
    );
    return lastValueFrom(res);
  }

  getVehicleManufacturer(filter?: FilterOptions): Promise<ListData<number>[]> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/VehicleManufacturer`
    );
    // url = this.concatFilter(url, filter);
    return lastValueFrom(res);
  }

  getCities(filter?: FilterOptions): Promise<ReturnedData<number>[]> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/Cities`,
      filter
    );
    // url = this.concatFilter(url, filter);
    return lastValueFrom(res);
  }

  async getInspectors(filter?: SelectParams): Promise<ReturnedData<string>> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/Inspectors`,
      filter
    );
    return lastValueFrom(res);
  }

  async getAllInspectors(
    filter?: SelectParams
  ): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/AllInspectors`,
      filter
    );
    return lastValueFrom(res);
  }

  getViolationDetailsList(filter?: SelectParams): Promise<ViolationDetails[]> {
    const res = this.httpService.getRequest<ViolationDetails[]>(
      `${this.apiController}/ViolationDetails`,
      filter
    );
    return lastValueFrom(res);
  }

  getCellularOperators(): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `Inventory/GetCellularOperators`
    );
    return lastValueFrom(res);
  }

  getViolationTypesList(params: {
    authorityID: string[];
    cityID?: string[];
  }): Promise<any[]> {
    //FIXME - make this dynamic
    const authorityIDs = params.authorityID;

    const id =
      authorityIDs && authorityIDs.length > 0
        ? authorityIDs[0]
        : '9d24f102-dbcc-49bc-8258-0b58af257b89';
    const res = this.httpService.getRequest<any[]>(
      `${this.apiController}/${id}/ViolationLookups`
    );
    return lastValueFrom(res);
  }

  //FIXME - make this dynamic
  getPrintingBoard(params: {
    authorityID: string[];
    noticeMessageOptionId: string;
  }): Promise<any> {
    const authorityIDs = params.authorityID;
    const id =
      authorityIDs && authorityIDs.length > 0
        ? authorityIDs[0]
        : '9d24f102-dbcc-49bc-8258-0b58af257b89';

    // Use params.noticeMessageOptionId as the UUID to find the corresponding enum value
    const messageType =
      params.noticeMessageOptionId as noticeMessageOptionsEnum;

    const res = this.httpService.getRequestForPdfCheck<any[]>(
      `GetPrintingBoard?authorityId=${id}&messageType=${messageType}`
    );
    return lastValueFrom(res);
  }

  getPermitTypes(
    filter?: FilterOptions,
    authorityIDs?: string[]
  ): Promise<ListData<number>[]> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/ParkingPermitTypes`,
      filter
    );

    return lastValueFrom(res);
  }

  async getTicketLookups(listName: string): Promise<Lookup | undefined> {
    if (!this.ticketLookups) {
      const res = this.httpService.getRequest<Lookup>(
        `${this.apiController}/TicketLookups`
      );
      this.ticketLookups = await lastValueFrom(res);
    }
    return this.ticketLookups;
  }

  async getVehicleLookups(
    listName: string
  ): Promise<Array<Lookup> | undefined> {
    const res = this.httpService.getRequest<Array<Lookup>>(
      `${this.apiController}/Vehicle`
    );

    return lastValueFrom(res);
  }

  async getGroups(filter?: SelectParams) {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/Groups`,
      filter
    );
    return lastValueFrom(res);
  }
  async getSystemRoles(filter?: SelectParams) {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/SystemRoles`,
      filter
    );
    return lastValueFrom(res);
  }

  getParkingPermitLookups(
    filter?: SelectParams
  ): Promise<ListData<number>[]> | [] {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/ParkingPermit`
    );

    return lastValueFrom(res);
  }

  getParkingPermitTypes(filter?: SelectParams): Promise<ListData<number>[]> {
    const res = this.httpService.getRequestWithQueryParams<ListData<number>[]>(
      `${this.apiController}/ParkingPermitTypes`,
      filter
    );

    return lastValueFrom(res);
  }

  async getPrintingTypes(
    filter?: SelectParams
  ): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/PrintingTypes`,
      filter
    );
    return lastValueFrom(res);
  }

  async getDeviceTypes(): Promise<ReturnedData<string>[]> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `Inventory/GetDeviceTypes`
    );
    return lastValueFrom(res);
  }

  getYesNoOptions(): Promise<ListData<boolean>[]> {
    return Utils.toPromise(GlobalOptions.yesNoOptions);
  }

  getDays(): Promise<ListData<boolean>[]> {
    return Utils.toPromise(GlobalOptions.days);
  }

  getPermitArea(): Promise<ListData<PermitByEnum>[]> {
    return Utils.toPromise(GlobalOptions.permitBy);
  }

  getPopulation(): Promise<ListData<boolean>[]> {
    return Utils.toPromise(GlobalOptions.population);
  }

  getLegalRequestsLookups(): Promise<ListData<number>[]> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/LegalRequest`
    );
    return lastValueFrom(res);
  }

  getPaymentOptions(): Promise<ListData<number>[]> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/PaymentOptions`
    );
    return lastValueFrom(res);
  }

  getBanksNames(): Promise<ListData<number>> {
    const res = this.httpService.getRequest<ListData<number>[]>(
      `${this.apiController}/Banks`
    );
    return lastValueFrom(res);
  }

  getBankBranches(filter?: SelectParams): Promise<ListData<number>> {
    const res = this.httpService.getRequestWithQueryParams<ListData<number>[]>(
      `${this.apiController}/BankBranches`,
      filter
    );
    return lastValueFrom(res);
  }

  getReservedActions(module: ActionModuleEnum): Observable<ReservedComment[]> {
    const res = this.httpService.getRequest<ReservedComment[]>(
      `${this.apiController}/ReservedActions/?module=${module}`
    );
    return res;
  }

  getPrintingMessageType(filter?: SelectParams): Promise<ListData<string>> {
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/PrintingMessageType`,
      filter
    );
    return lastValueFrom(res);
  }
  
  getDeliveryMethodsTypes(filter?: SelectParams): Promise<ListData<string>> {
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/DeliveryMethods`,
      filter
    );
    return lastValueFrom(res);
  }

  getDeviceStatuses(): Promise<ListData<string>> {
    const res = this.httpService.getRequest<ListData<string>[]>(
      `${this.apiController}/DeviceStatuses`
    );
    return lastValueFrom(res);
  }

  getTextTemplates(filter?: SelectParams) {
    const updatedFilter = {
      ...filter,
      TypeId: TemplatesTypesEnum.TEXT,
    };
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/Templates`,
      updatedFilter
    );

    return lastValueFrom(res);
  }
  getImagesTemplates(filter?: SelectParams) {
    const updatedFilter = {
      ...filter,
      TypeId: TemplatesTypesEnum.LOGO,
    };
    const res = this.httpService.getRequestWithQueryParams<ListData<string>[]>(
      `${this.apiController}/Templates`,
      updatedFilter
    );

    return lastValueFrom(res);
  }
}
