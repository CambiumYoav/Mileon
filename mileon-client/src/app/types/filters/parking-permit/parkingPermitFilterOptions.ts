import { FilterOptions } from '../filterOptions';

export class ParkingPermitFilterOptions extends FilterOptions {
  parkingPermitsOptionsFilter: ParkingPermitOptionsFilter;

  constructor(args: ParkingPermitFilterOptions) {
    super();
    this.parkingPermitsOptionsFilter =
      args?.parkingPermitsOptionsFilter || new ParkingPermitOptionsFilter({});
  }
}
export class ParkingPermitOptionsFilter {
  parkingPermitStatusIDs?: number[];
  permitTypeIDs?: number[];
  authorityIDs?: string[];
  areaIDs?: number[];
  streetIDs?: number[];
  houseNumber?: number;
  vehicleNumber?: string;
  vehicleManufacturerIDs?: number[];
  vehicleColorIDs?: number[];
  isReturningResident?: boolean; 
  payMethodId?: number;
  days?: number[];
  fromExpirationDate?: Date;
  toExpirationDate?: Date;
  time?: Date;
  fromTime?: Date;
  toTime?: Date;
  requestSourceIDs?: number;

  constructor(args: ParkingPermitOptionsFilter) {
    this.parkingPermitStatusIDs = args?.parkingPermitStatusIDs;
    this.permitTypeIDs = args?.permitTypeIDs;
    this.authorityIDs = args?.authorityIDs;
    this.areaIDs = args?.areaIDs;
    this.streetIDs = args?.streetIDs;
    this.houseNumber = args?.houseNumber;
    this.vehicleNumber = args?.vehicleNumber;
    this.vehicleManufacturerIDs = args?.vehicleManufacturerIDs;
    this.payMethodId = args?.payMethodId;
    this.vehicleColorIDs = args?.vehicleColorIDs;
    this.isReturningResident = args?.isReturningResident;
    this.days = args?.days;
    this.fromExpirationDate = args?.fromExpirationDate;
    this.toExpirationDate = args?.toExpirationDate;
    this.time = args.time;
    this.fromTime = args?.fromTime;
    this.toTime = args?.toTime;
    this.requestSourceIDs = args?.requestSourceIDs;
  }
}
