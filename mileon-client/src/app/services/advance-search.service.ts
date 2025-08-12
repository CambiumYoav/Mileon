import { Injectable } from '@angular/core';
import { ListData } from '../types/listData';

@Injectable({
  providedIn: 'root'
})
export class AdvanceSearchService {

  //#region  ticketAdvancedSearch
  selectedAuthorities: Array<ListData<string>> = new Array<ListData<string>>()
  selectedViolationStreets: Array<ListData<string>> = new Array<ListData<string>>()
  selectedAreas: Array<ListData<string>> = new Array<ListData<string>>()
  selectedVehicleManufacturers: Array<ListData<string>> = new Array<ListData<string>>()
  selectedViolationDetails: Array<ListData<string>> = new Array<ListData<string>>()
  selectedCities: Array<ListData<string>> = new Array<ListData<string>>()
  selectedOwnerStreets: Array<ListData<string>> = new Array<ListData<string>>()

  //#endregion


  //#region ParkingPermitAdvancedSearch
  selectedParkingPermitAuthorities: Array<ListData<string>> = new Array<ListData<string>>()
  selectedParkingPermitStreets: Array<ListData<string>> = new Array<ListData<string>>()
  selectedParkingPermitAreas: Array<ListData<string>> = new Array<ListData<string>>()
  selectedParkingPermitTypes: Array<ListData<string>> = new Array<ListData<string>>()

  //#endregion

  constructor() { }
}
