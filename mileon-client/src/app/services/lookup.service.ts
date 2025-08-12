import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { FilterOptions } from '../types/filters/filterOptions';
import { TicketFilterOptions } from '../types/filters/ticket/ticketFilterOptions';
import { ListData } from '../types/listData';
import { Lookup } from '../types/lookup';
import { SubStage } from '../types/subStage';
import { ViolationDetails } from '../types/violationDetails';
import { BaseService } from './base.service';
// Remove this service
@Injectable({
  providedIn: 'root',
})
export class LookupService {
  // : Array<Lookup>
  //#region  ticketLookups
  // ticketLookups
  // private ticketLookupsSubject: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  // private ticketLookupsSubject$: Observable<any[]> = this.ticketLookupsSubject.asObservable();
  // isTicketLookupsUpdated: boolean = false;
  // ticketTypes: Array<ListData<number>>
  // ticketResources: Array<ListData<number>>
  // ticketStatuses: Array<ListData<number>>
  // ticketStages: Array<ListData<number>>
  // fileTypes: Array<ListData<number>>
  // vehicleTypes: Array<ListData<number>>
  // ticketSubStages: Array<SubStage>
  // //#endregion
  // //#region  VehicleLookups
  // vehicleLookups
  // private vehicleLookupsSubject: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  // private vehicleLookupsSubject$: Observable<any[]> = this.vehicleLookupsSubject.asObservable();
  // isVehicleLookupsUpdated: boolean = false;
  // vehicleManufacturers: Array<ListData<number>>
  // vehicleColors: Array<ListData<number>>
  // //#endregion
  // //#region parking permit
  // parkingPermitLookups
  // private parkingPermitLookupsSubject: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  // private parkingPermitLookupsSubject$: Observable<any[]> = this.parkingPermitLookupsSubject.asObservable();
  // isParkingPermitLookupsUpdated: boolean = false;
  // parkingPermitStatuses: Array<ListData<number>>
  // requestSources: Array<ListData<number>>
  // //#endregion
  // pageSize: number = 10;
  // lookupUrl: string = this.baseService.baseUrl + '/Lookup';
  // ticketStatusMap = new Map<number, string>()
  // ticketTypesMap = new Map<number, string>()
  // ticketStageMap = new Map<number, string>()
  // ticketSubStageMap = new Map<number, SubStage>()
  // ticketResourceMap = new Map<number, string>()
  // fileTypeMap = new Map<number, string>()
  // VehicleTypeMap = new Map<number, string>()
  // constructor(
  //   private baseService: BaseService,
  //   private http: HttpClient
  // ) {}
  // uploadTicketLookups(): Observable<Array<Lookup>> {
  //   if (!this.isTicketLookupsUpdated) {
  //     this.isTicketLookupsUpdated = true;
  //     this.getTicketLookupsRequest().subscribe({
  //       next: (res) => {
  //         this.ticketLookups = res;
  //         this.populateTicketLookups();
  //         this.ticketLookupsSubject.next(this.ticketLookups)
  //       },
  //       error: (err) => {
  //         this.isTicketLookupsUpdated = false;
  //       }
  //     })
  //   }
  //   return this.ticketLookupsSubject$;
  // }
  // getTicketLookupsRequest() {
  //   const url = `${this.lookupUrl}/TicketLookups`
  //   return this.http.get<Array<Lookup>>(url, this.baseService.httpOptions)
  // }
  // populateTicketLookups() {
  //   this.ticketTypes = this.ticketLookups.ticketTypes;
  //   this.ticketResources = this.ticketLookups.ticketResources;
  //   this.ticketStatuses = this.ticketLookups.ticketStatuses;
  //   this.ticketStages = this.ticketLookups.ticketStages;//שלב
  //   this.ticketSubStages = this.ticketLookups.ticketSubStages;//פעולה
  //   this.fileTypes = this.ticketLookups.fileTypes;
  //   this.initMap(this.ticketStatuses, this.ticketStatusMap);
  //   this.initMap(this.ticketTypes, this.ticketTypesMap);
  //   this.initMap(this.ticketStages, this.ticketStageMap);
  //   this.initSubStageMap(this.ticketSubStages, this.ticketSubStageMap);
  //   this.initMap(this.ticketResources, this.ticketResourceMap);
  //   this.initMap(this.fileTypes, this.fileTypeMap);
  // }
  // initMap(list, map) {
  //   for (let index = 0; index < list.length; index++) {
  //     const element = list[index];
  //     map.set(element.id, element.value)
  //   }
  // }
  // initSubStageMap(list: Array<SubStage>, map) {
  //   for (let index = 0; index < list.length; index++) {
  //     const element = list[index];
  //     map.set(element.id, element)
  //   }
  // }
  // getTicketTypes() {
  //   return this.ticketTypes
  // }
  // getTicketResources() {
  //   return this.ticketResources
  // }
  // getTicketStatuses() {
  //   return this.ticketStatuses
  // }
  // getTicketStages() {
  //   return this.ticketStages
  // }
  // getTicketSubStages() {
  //   return this.ticketSubStages
  // }
  // getfileTypes() {
  //   return this.fileTypes
  // }
  // getAuthorities(filter?: FilterOptions, streetID?: number): Observable<ListData<string>[]> {
  //   let url = `${this.lookupUrl}/Authorities`;
  //   url = this.concatFilter(url, filter);
  //   if (streetID) {
  //     if (url.includes('?')) {
  //       url += `&streetID=${streetID}`
  //     }
  //     else {
  //       url += `?streetID=${streetID}`
  //     }
  //   }
  //   return this.http.get<ListData<string>[]>(url, this.baseService.httpOptions)
  // }
  // //to do cityid
  // getStreets(filter?: FilterOptions, authorityIDs?: string[], cityIDs?: string[]): Observable<ListData<string>[]> {
  //   let url = `${this.lookupUrl}/Streets`;
  //   url = this.concatFilter(url, filter, authorityIDs, cityIDs);
  //   return this.http.get<ListData<string>[]>(url, this.baseService.httpOptions)
  // }
  // getAreas(filter?: FilterOptions, authorityIDs?: string[]) {
  //   let url = `${this.lookupUrl}/Areas`;
  //   url = this.concatFilter(url, filter, authorityIDs);
  //   return this.http.get<ListData<number>[]>(url, this.baseService.httpOptions)
  // }
  // getVehicleManufacturer(filter?: FilterOptions) {
  //   let url = `${this.lookupUrl}/VehicleManufacturer`;
  //   url = this.concatFilter(url, filter);
  //   return this.http.get<ListData<number>[]>(url, this.baseService.httpOptions)
  // }
  // getCities(filter?: FilterOptions) {
  //   let url = `${this.lookupUrl}/Cities`;
  //   url = this.concatFilter(url, filter);
  //   return this.http.get<ListData<number>[]>(url, this.baseService.httpOptions)
  // }
  // getViolationDetailsList(filter?: FilterOptions) {
  //   let url = `${this.lookupUrl}/ViolationDetails`;
  //   url = this.concatFilter(url, filter);
  //   return this.http.get<ViolationDetails[]>(url, this.baseService.httpOptions)
  // }
  // getPermitTypes(filter?: FilterOptions, authorityIDs?: string[]) {
  //   let url = `${this.lookupUrl}/ParkingPermitTypes`;
  //   url = this.concatFilter(url, filter, authorityIDs);
  //   return this.http.get<ListData<number>[]>(url, this.baseService.httpOptions)
  // }
  // getParkingPermitLookups(filter?: FilterOptions, authorityIDs?: string[]) {
  //   let url = `${this.lookupUrl}/ParkingPermit`;
  //   url = this.concatFilter(url, filter, authorityIDs);
  //   return this.http.get<ListData<number>[]>(url, this.baseService.httpOptions)
  // }
  // concatFilter(url: string, filter?: FilterOptions, authorityIDs?: string[], cityIDs?: string[]): string {
  //   if (!filter) return url
  //   let isAdd = false
  //   if (filter.searchText) {
  //     url += `?searchText=${filter.searchText.trim()}`
  //     isAdd = true
  //   }
  //   if (filter.orderByField) {
  //     url += `${isAdd ? '&' : '?'}orderByField=${filter.orderByField}`
  //     if (filter.order || filter.order === 0) {
  //       url += `&order=${filter.order}`
  //     }
  //     isAdd = true
  //   }
  //   if (filter.pageSize) {
  //     url += `${isAdd ? '&' : '?'}pageSize=${filter.pageSize}`
  //     isAdd = true
  //   }
  //   if (filter.currentPage) {
  //     url += `${isAdd ? '&' : '?'}currentPage=${filter.currentPage}`
  //     isAdd = true
  //   }
  //   if (authorityIDs) {
  //     authorityIDs.forEach(a => {
  //       url += `${isAdd ? '&' : '?'}authorityIDs=${a}`
  //       isAdd = true
  //     })
  //   }
  //   if (cityIDs) {
  //     cityIDs.forEach(a => {
  //       url += `${isAdd ? '&' : '?'}cityIDs=${a}`
  //       isAdd = true
  //     })
  //   }
  //   return url
  // }
  // getVehicleLookupsRequest() {
  //   const url = `${this.lookupUrl}/Vehicle`
  //   return this.http.get<Array<Lookup>>(url, this.baseService.httpOptions)
  // }
  // uploadVehicleLookups(): Observable<Array<Lookup>> {
  //   if (!this.isVehicleLookupsUpdated) {
  //     this.isVehicleLookupsUpdated = true;
  //     this.getVehicleLookupsRequest().subscribe({
  //       next: (res) => {
  //         this.vehicleLookups = res;
  //         this.populateVehicleLookups();
  //         this.vehicleLookupsSubject.next(this.vehicleLookups)
  //       },
  //       error: (err) => {
  //         this.isVehicleLookupsUpdated = false;
  //       }
  //     })
  //   }
  //   return this.vehicleLookupsSubject$;
  // }
  // populateVehicleLookups() {
  //   this.vehicleManufacturers = this.vehicleLookups.vehicleManufacturers;
  //   this.vehicleColors = this.vehicleLookups.vehicleColors;
  //   this.vehicleTypes = this.vehicleLookups.vehicleTypes;
  //   this.initMap(this.vehicleTypes, this.VehicleTypeMap);
  // }
  // getVehicleManufacturers() {
  //   return this.vehicleManufacturers
  // }
  // getVehicleColors() {
  //   return this.vehicleColors
  // }
  // getVhicleTypes() {
  //   return this.vehicleTypes
  // }
  // getParkingPermitLookupsRequest() {
  //   const url = `${this.lookupUrl}/ParkingPermit`
  //   return this.http.get<Array<Lookup>>(url, this.baseService.httpOptions)
  // }
  // uploadParkingPermitLookups(): Observable<Array<Lookup>> {
  //   if (!this.isParkingPermitLookupsUpdated) {
  //     this.isParkingPermitLookupsUpdated = true;
  //     this.getParkingPermitLookupsRequest().subscribe({
  //       next: (res) => {
  //         this.parkingPermitLookups = res;
  //         this.populateParkingPermitLookups();
  //         this.parkingPermitLookupsSubject.next(this.parkingPermitLookups)
  //       },
  //       error: (err) => {
  //         this.isParkingPermitLookupsUpdated = false;
  //       }
  //     })
  //   }
  //   return this.parkingPermitLookupsSubject$;
  // }
  // populateParkingPermitLookups() {
  //   this.parkingPermitStatuses = this.parkingPermitLookups.parkingPermitStatuses;
  //   this.requestSources = this.parkingPermitLookups.requestSources;
  // }
  // getParkingPermitStatuses() {
  //   return this.parkingPermitStatuses;
  // }
  // getRequestSources(){
  //   return this.requestSources;
  // }
}
