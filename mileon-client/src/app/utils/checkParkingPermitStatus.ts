import { ParkingPermitType } from '../types/parkingPermit/parkingPermitType';
import {
  isParkingPermit,
  isParkingPermitDetails,
} from './checkParkingPermitType';

export function getParkingPermitStatus(parkingPermit: ParkingPermitType) {
  let cost: number = parkingPermit?.cost ?? 0;
  let parkingPermitStatus: number = 0;

  if (isParkingPermitDetails(parkingPermit)) {
    parkingPermitStatus = parkingPermit?.statusId;
  } else if (isParkingPermit(parkingPermit)) {
    parkingPermitStatus = parkingPermit?.parkingPermitStatus.id ?? 0;
  }

  return { cost, parkingPermitStatus };
}
