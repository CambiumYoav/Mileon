import {ParkingPermitStatusEnum} from "../enum/parkingPermitStatusEnums";

export interface ParkingPermitStatus {
  parkingPermitID: string;
  statusID: ParkingPermitStatusEnum;
}
