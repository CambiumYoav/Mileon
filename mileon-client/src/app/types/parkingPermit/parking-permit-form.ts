import { Address } from "../address"
import { Citizen } from "../citizen"
import { CitizenPhone } from "../citizenPhones"
import { ParkingPermitArea } from "./parkingPermitArea"
import { ParkingPermitDetails } from "./parkingPermitDetails"
import { ParkingPermitRemark } from "./parkingPermitRemark"
import { TimeLimit } from "./timeLimit"


export class ParkingPermitDetailsForm {
    parkingPermitID?: string = ''
    parkingPermitNumber: string = ''
    statusId: number | undefined = undefined
    statusName: string = ''
    vehicle: VehicleForm = { 'colorID': undefined, vehicleNumber: undefined, modelID: undefined, manufacturerID: undefined, modelName: '', colorName: '', manufacturerName: '' }
    address: Address = new Address();
    citizen: Citizen = { citizenID: undefined, firstName: '', lastName: '', homeAddress:new Address() , postalAddress: new Address, citizenPhones: [{ phone: '', isMain: true }, { phone: '', isMain: false }], email: '', birthDate: undefined, nid: '', passportID: '' , genderID: undefined, isSeniorCitizen: undefined};
    authorityID: string = ''
    renewalReasonID: number | undefined = undefined
    renewalReasonName: string = ''
    timeLimits: TimeLimit[] = []
    startDate: Date | undefined = undefined
    expirationDate: Date | undefined = undefined
    parkingPermitRemarks: ParkingPermitRemark[] = []
    requestSourceID: number | undefined = undefined
    requestSourceName: string = ''
    requestDate: Date | undefined = undefined
    approvalDate: Date | undefined = undefined
    userName: string = ''
    sendReminderWhenExpired: boolean | undefined = undefined
    parkingPermitAreas: ParkingPermitArea[] = []
    parkingPermitStreets: ParkingPermitArea[] = []
    isPermitToAllCity: boolean | undefined = undefined
    permitTypeID: number | undefined = undefined
    permitTypeName: string = ''
}


export class VehicleForm {
    vehicleNumber?: number
    colorID?: number
    colorName?: string
    manufacturerID: number | undefined
    manufacturerName: string
    modelID: number | undefined
    modelName: string
    manufacturerYear?: number
    constructor(vehicleFormFields: VehicleForm) {
        this.vehicleNumber = vehicleFormFields.vehicleNumber;
        this.colorID = vehicleFormFields.colorID;
        this.colorName = vehicleFormFields.colorName;
        this.manufacturerID = vehicleFormFields.manufacturerID;
        this.manufacturerName = vehicleFormFields.manufacturerName;
        this.modelID = vehicleFormFields.modelID;
        this.modelName = vehicleFormFields.modelName;
        this.manufacturerYear = vehicleFormFields.manufacturerYear;
    }

    // add validation for the vehicle number.
}

export class CitizenForm {
    citizenID?: string;
    citizenPhones?: CitizenPhone[];
    email?: string;
    firstName: string;
    lastName: string;
    fullName?: string;
    nid?: string;
    cn?: string;
    passportID?: string;
    isReturningResident?: boolean;
    isSeniorCitizen?: boolean;
    birthDate?: Date;
    genderID?: number;
    homeAddress: Address; // כתובת מגורים
    postalAddress: Address; // כתובת למשלוח דואר
    interiorMinistryHomeAddress?: Address; // כתובת מגורים משרד הפנים
    interiorMinistryPostalAddress?: Address; // כתובת דואר ממשרד הפנים

    constructor(citizenFormFields: CitizenForm) {
        this.citizenID = citizenFormFields.citizenID;
        this.citizenPhones = citizenFormFields.citizenPhones;
        this.email = citizenFormFields.email;
        this.firstName = citizenFormFields.firstName;
        this.lastName = citizenFormFields.lastName;
        this.fullName = citizenFormFields.fullName;
        this.nid = citizenFormFields.nid;
        this.cn = citizenFormFields.cn;
        this.passportID = citizenFormFields.passportID;
        this.isReturningResident = citizenFormFields.isReturningResident;
        this.birthDate = citizenFormFields.birthDate;
        this.genderID = citizenFormFields.genderID;
        this.homeAddress = citizenFormFields.homeAddress;
        this.postalAddress = citizenFormFields.postalAddress;
        this.interiorMinistryHomeAddress = citizenFormFields.interiorMinistryHomeAddress;
        this.interiorMinistryPostalAddress = citizenFormFields.interiorMinistryPostalAddress;
        this.isSeniorCitizen = citizenFormFields.isSeniorCitizen;
    }
    // add validation


}

