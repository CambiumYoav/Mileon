import { Validators } from "@angular/forms"
import { Address } from "../address"
import { Citizen } from "../citizen"
import { CitizenPhone } from "../citizenPhones"
import { FromTo } from "../infrastructure/infrastructureFilterOptions"
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

export class PermitsTypesSettingsForm {
    permitsByIdCount: number;
    constructor(args: PermitsTypesSettingsForm) {
      this.permitsByIdCount = args.permitsByIdCount;
    }
    static permitsTypesSettingsValidations = {
      permitsByIdCount: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.min(0),
        Validators.max(20),
      ],
    };
  }
  
  export class PermitTypeSettings {
    // Row 1
    authorityPermitTypeID: number | null;
    permitTypeDescription: string;
    cost: number | null;
    timeGivingPermit: string; // '0' for days, '1' for months, '2' for years, '3' for dates
    permitDurationInDays: number | string | null;
    permitDurationInYears: number | string | null;
    permitDurationInMonths: number | string | null;
    permitEndDate: number | string | null;
  
    // Row 2
    activeDays: number[]; // e.g., ['sunday', 'monday']
    fromTime: string; // Format "HH:mm"
    toTime: FromTo; // Format "HH:mm"
    isAllDay: boolean;
  
    // Row 3
    allowRenewDaysCount: number;
    allowRenewDaysCountAferExp: number;
    smsRenewDaysCount: number;
    casualParkingSlot: boolean;
  
    // Row 4
    noFeeNeededDuration: number;
    leftSideMasoufun: boolean;
    rightSideMasoufun: boolean;
    permitsByType: number;
  
    // Row 5
    autoTicketCancellation: boolean;
    mailApproveTemplate: number | null;
    smsApproveTemplate: number | null;
    letterOfDeclaration: number | null;
  
    // Row 6
    canRenewNumberOfRequests: number | null;
    manAgeSeniorResident: number;
    womanAgeSeniorResident: number;
    parkingPermitPrinting: '0' | '1'; // '0' for virtual, '1' for sticker
  
    // Row 7
    isRealPermit: boolean;
    areasId: number[] | null;
    authorityID: number | null;
  
    constructor(data?: any) {
      const d = data || {};
      this.authorityPermitTypeID = d.authorityPermitTypeID ?? null;
      this.permitTypeDescription = d.permitTypeDescription ?? '';
      this.cost = d.cost ?? null;
      this.timeGivingPermit = d.timeGivingPermit ?? '0';
      this.permitDurationInDays = d.permitDurationInDays ?? null;
      this.permitDurationInMonths = d.permitDurationInMonths;
      this.permitEndDate = d.permitEndDate;
      this.permitDurationInYears = d.permitDurationInYears;
  
      this.activeDays = d.activeDays ?? [];
      // The 'fromTime' field is used for both a time range and an "all day" checkbox.
      // We'll separate these into distinct properties for clarity.
      this.fromTime = d.fromTime ?? '00:00';
      this.toTime = d.toTime ?? '23:59';
      this.isAllDay = d.isAllDay ?? false;
  
      this.allowRenewDaysCount = d.allowRenewDaysCount ?? 30;
      this.allowRenewDaysCountAferExp = d.allowRenewDaysCountAferExp ?? 0;
      this.smsRenewDaysCount = d.smsRenewDaysCount ?? 30;
      this.casualParkingSlot = d.casualParkingSlot ?? false;
  
      this.noFeeNeededDuration = d.noFeeNeededDuration ?? 0;
      this.leftSideMasoufun = d.leftSideMasoufun ?? false;
      this.rightSideMasoufun = d.rightSideMasoufun ?? false;
      this.permitsByType = d.permitsByType ?? 1;
  
      this.autoTicketCancellation = d.autoTicketCancellation ?? false;
      this.mailApproveTemplate = d.mailApproveTemplate ?? null;
      this.smsApproveTemplate = d.smsApproveTemplate ?? null;
      this.letterOfDeclaration = d.letterOfDeclaration ?? null;
  
      this.canRenewNumberOfRequests = d.canRenewNumberOfRequests ?? null;
      this.manAgeSeniorResident = d.manAgeSeniorResident ?? 60;
      this.womanAgeSeniorResident = d.womanAgeSeniorResident ?? 60;
      this.parkingPermitPrinting = d.parkingPermitPrinting ?? '0';
  
      this.isRealPermit = d.isRealPermit ?? false;
      this.areasId = d.areasId ?? null;
      this.authorityID = d.authorityID ?? null;
    }
  }
  