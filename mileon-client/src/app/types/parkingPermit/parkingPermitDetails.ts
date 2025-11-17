import { Address } from "../address"
import { Citizen } from "../citizen"
import { Vehicle } from "../vehicle"
import { ParkingPermitArea } from "./parkingPermitArea"
import { ParkingPermitFile } from "./parkingPermitFile"
import { ParkingPermitRemark } from "./parkingPermitRemark"
import { TimeLimit } from "./timeLimit"

export class ParkingPermitDetails {
    parkingPermitID!: string
    parkingPermitNumber!: number
    statusId!: number
    statusName!: string
    vehicle!: Vehicle
    citizen!: Citizen
    address!: Address
    authorityID!: string
    renewalReasonID!: number
    renewalReasonName!: string
    timeLimits!: TimeLimit[]
    startDate!: Date
    expirationDate!: Date
    parkingPermitRemarks!: ParkingPermitRemark[]
    requestSourceID!: number
    requestSourceName!: string
    requestDate!: Date
    approvalDate!: Date
    userName!: string
    sendReminderWhenExpired!: boolean
    parkingPermitAreas!: ParkingPermitArea[]
    parkingPermitStreets!: ParkingPermitArea[]
    isPermitToAllCity!: boolean
    permitTypeID!: number
    permitTypeName!: string
    parkingPermitFiles!: ParkingPermitFile[]
    cost!: number
    authorityName!: string
}
