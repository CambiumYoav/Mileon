import {ParkingPermitDetails} from "../types/parkingPermit/parkingPermitDetails";
import {ParkingPermit} from "../types/parkingPermit/parkingPermit";

export function isParkingPermit(obj: any): obj is ParkingPermit {
  return obj instanceof ParkingPermit;
}

export function isParkingPermitDetails(permit: ParkingPermit | ParkingPermitDetails): permit is ParkingPermitDetails {
  return (permit as ParkingPermitDetails).statusName !== undefined;
}
