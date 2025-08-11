import { FilterOptions } from '../filters/filterOptions';

export class InfrastructureFilterOptions extends FilterOptions {
  vehicleColorFilter?: VehicleColor;
  vehicleTypeFilter?: VehicleType;
  vehicleManufacturer?: VehicleManufacturer;
  ticketSubStageFilter?: TicketSubStage;
  viloationTypes?: ViloationTypes;
  statusTypes?: StatusTypes;
  stagesTypes?: StagesTypes;
  citizensTypes?: CitizensTypes;
  chipsTypes?: ChipsTypes;
  plaintiffsCausesTypes?: PlaintiffsCausesTypes;
  signsTypes?: SignsTypes;
  businessType?: BusinessType;
  deliveryMethodType?: DeliveryMethodType;
  includeInactive?: boolean;
  date?: Date | string;
  constructor(args: InfrastructureFilterOptions) {
    super();
    this.vehicleColorFilter = args?.vehicleColorFilter || new VehicleColor({});
    this.vehicleTypeFilter = args?.vehicleTypeFilter || new VehicleType({});
    this.vehicleManufacturer =
      args?.vehicleManufacturer || new VehicleManufacturer({});
    this.ticketSubStageFilter =
      args?.ticketSubStageFilter || new TicketSubStage({});
    this.viloationTypes = args?.viloationTypes || new ViloationTypes({});
    this.statusTypes = args?.statusTypes || new StatusTypes({});
    this.stagesTypes = args?.stagesTypes || new StagesTypes({});
    this.citizensTypes = args?.citizensTypes || new CitizensTypes({});
    this.chipsTypes = args?.chipsTypes || new ChipsTypes({});
    this.plaintiffsCausesTypes =
      args.plaintiffsCausesTypes || new PlaintiffsCausesTypes({});
    this.signsTypes = args?.signsTypes || new SignsTypes({});
    this.businessType = args?.businessType || new BusinessType({});
    this.deliveryMethodType =
      args?.deliveryMethodType || new DeliveryMethodType({});
    this.includeInactive = args?.includeInactive;
    this.date = args.date;
  }
}

export class VehicleType {
  automationCode?: number;
  name?: string;
  sendToDevice?: boolean;
  vehicleTypeDescription?: string;
  vehicleTypeID?: number;
  isActive?: boolean;

  constructor(args: VehicleType) {
    this.vehicleTypeID = args.vehicleTypeID;
    this.vehicleTypeDescription = args.vehicleTypeDescription;
    this.name = args.name;
    this.automationCode = args.automationCode;
    this.isActive = args.isActive;
    this.sendToDevice = args.sendToDevice;
  }
}

export class VehicleColor {
  vehicleColorID?: number;
  name?: string;
  automationCode?: number;
  isActive?: boolean;
  sendToDevice?: boolean;

  constructor(args: VehicleColor) {
    this.vehicleColorID = args.vehicleColorID;
    this.name = args.name;
    this.automationCode = args.automationCode;
    this.isActive = args.isActive;
    this.sendToDevice = args.sendToDevice;
  }
}

export class VehicleManufacturer {
  manufacturerID?: number;
  name?: string;
  automationCode?: number;
  isActive?: boolean;
  sendToDevice?: boolean;

  constructor(args: VehicleManufacturer) {
    this.manufacturerID = args.manufacturerID;
    this.name = args.name;
    this.automationCode = args.automationCode;
    this.isActive = args.isActive;
    this.sendToDevice = args.sendToDevice;
  }
}

export interface TicketStatus {
  ticketStatusID: number;
  ticketStatusName: string;
  description: string | null;
}
export class TicketSubStage {
  subStageID?: number;
  name?: string;
  ticketStatusID?: number;
  ticketStatusName?: string;
  isActive?: boolean;
  ticketStageID?: number;
  type?: number;
  isMarked?: boolean;
  description?: string;
  ticketStage?: any; //change this
  ticketStatus?: TicketStatus;

  constructor(args: TicketSubStage) {
    this.subStageID = args.subStageID;
    this.name = args.name;
    this.ticketStatusName = args.ticketStatusName;
    this.ticketStageID = args.ticketStageID;
    this.isMarked = args.isMarked;
    this.description = args.description;
    this.ticketStage = args.ticketStage;
    this.ticketStatusID = args.ticketStatusID;
    this.isActive = args.isActive;
    this.ticketStatus = args.ticketStatus;
  }
}

export class ViloationTypes {
  violationTypeID?: number;
  name?: number;
  automationCode?: string;
  ticketTypeID?: number;
  ticketType?: string;
  MAGAKInterfaceCode?: string;
  metroparkInterfaceCode?: string;
  authorityID?: string;
  constructor(args: ViloationTypes) {
    this.violationTypeID = args.violationTypeID;
    this.automationCode = args.automationCode;
    this.name = args.name;
    this.MAGAKInterfaceCode = args.MAGAKInterfaceCode;
    this.metroparkInterfaceCode = args.metroparkInterfaceCode;
    this.ticketTypeID = args.ticketTypeID;
    this.ticketType = args.ticketType;
    this.authorityID = args.authorityID;
  }
}
export class StreetsTypes {
  streetID: number;
  streetName: string;
  previousStreetName: string | null;
  streetCode: string | null;
  authorityID: string | null;
  cityID: number;
  cityCode: string | null;
  areaID: string | null;
  automationCode: string | null;
  parkingAutomationCode: string | null;
  businessAutomationCode: string | null;
  isActive: boolean;
  sendToDevice: boolean;
  authority: string | null;
  city: number | null;
  area: number | null;
  associationSupervisionArea: string[] | null;
  evenResidenceNumbers: FromTo | null;
  entitledTenantSignEvenNumbers: FromTo | null;
  entitledTenantSignOddNumbers: FromTo | null;
  registeringWarningReport: boolean | null;
  minutesContinuousParking: number | null;
  transmissionToTerminal: boolean;
  oddResidenceNumbers: string | null;
  parkingForbiddenHoursOne: FromTo | null;
  parkingForbiddenHoursTwo: FromTo | null;
  parkingForbiddenHoursThree: FromTo | null;

  constructor(args: StreetsTypes) {
    this.streetID = args.streetID || 0;
    this.streetName = args.streetName;
    this.previousStreetName = args.previousStreetName || null;
    this.streetCode = args.streetCode || '0';
    this.authorityID = args.authorityID || null;
    this.cityID = args.cityID || 1;
    this.cityCode = args.cityCode || null;
    this.areaID = args.areaID || null;
    this.automationCode = args.automationCode || null;
    this.parkingAutomationCode = args.parkingAutomationCode || null;
    this.businessAutomationCode = args.businessAutomationCode || null;
    this.isActive = args.isActive = true;
    this.sendToDevice = args.sendToDevice = false;
    this.authority = args.authority || null;
    this.city = args.city || null;
    this.area = args.area || null;
    this.associationSupervisionArea = args.associationSupervisionArea || null;
    this.evenResidenceNumbers = args.evenResidenceNumbers || null;
    this.entitledTenantSignEvenNumbers =
      args.entitledTenantSignEvenNumbers || null;
    this.entitledTenantSignOddNumbers =
      args.entitledTenantSignOddNumbers || null;
    this.registeringWarningReport = args.registeringWarningReport || false;
    this.minutesContinuousParking = args.minutesContinuousParking || 0;
    this.transmissionToTerminal = args.transmissionToTerminal || false;
    this.oddResidenceNumbers = args.oddResidenceNumbers || null;
    this.parkingForbiddenHoursOne = args.parkingForbiddenHoursOne || null;
    this.parkingForbiddenHoursTwo = args.parkingForbiddenHoursTwo || null;
    this.parkingForbiddenHoursThree = args.parkingForbiddenHoursThree || null;
  }
}

export class AreaTypes {
  areaID: number;
  areaName: string;
  parkingType: number;
  authorityID: string | null;
  authority: string | null;
  streets: string[] | StreetsIds[] | null;
  linkedInspectors: string[] | UserIds[] | null;
  parkingTypeDisplay?: string;
  streetsDisplay?: string;
  constructor(args: AreaTypes) {
    this.areaID = args.areaID || 0;
    this.areaName = args.areaName;
    this.parkingType = args.parkingType;
    this.authorityID = args.authorityID || null;
    this.authority = args.authority || null;
    this.streets = args.streets || [];
    this.linkedInspectors = args.linkedInspectors || [];
  }
}

export type FromTo = {
  from: string;
  to: string;
};

export type StreetsIds = {
  streetID: string;
};
export type UserIds = {
  userID: string;
};

export class StatusTypes {
  ticketStatusID?: number;
  ticketStatusName?: string;

  constructor(args: StatusTypes) {
    this.ticketStatusID = args.ticketStatusID;
    this.ticketStatusName = args.ticketStatusName;
  }
}

export class StagesTypes {
  stageID?: number;
  name?: string;

  constructor(args: StagesTypes) {
    this.stageID = args.stageID;
    this.name = args.name;
  }
}

export class CitizensTypes {
  citizenID?: string;
  citizenCode?: number;
  nid?: string;
  lastName?: string;
  firstName?: string;
  homeAddress?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  entrance?: string;
  apartment?: string;
  postalCode?: string;
  mailBox?: string;
  phone?: string;
  citizenPhones?: string; //?
  email?: string;
  lastUpdated?: Date;

  constructor(args: CitizensTypes) {
    this.citizenID = args.citizenID;
    this.citizenCode = args.citizenCode;
    this.nid = args.nid;
    this.lastName = args.lastName;
    this.firstName = args.firstName;
    this.homeAddress = args.homeAddress;
    this.city = args.city;
    this.street = args.street;
    this.houseNumber = args.houseNumber;
    this.entrance = args.entrance;
    this.apartment = args.apartment;
    this.postalCode = args.postalCode;
    this.mailBox = args.mailBox;
    this.phone = args.phone;
    this.citizenPhones = args.citizenPhones; // ?
    this.email = args.email;
    this.lastUpdated = args.lastUpdated;
  }
}

export class Street {
  streetName: string;
}
export class City {
  cityName: string;
}
export class Address {
  street: Street;
  addressId?: string;
  houseNumber?: string;
  apartment?: string;
  cityID?: string;
  streetID?: string;
  cityName?: string;
  streetName?: string;
  city?: City;
}
export class ChipsTypes {
  chipID?: number;
  chipNumber?: number;
  ownerID?: string;
  ownerPassport?: string;
  firstName?: string;
  lastName?: string;
  addressId?: string;
  address?: Address;
  streetName?: string;
  houseNumber?: number;
  postalCode?: string;
  entrance?: number;
  apartment?: number;
  mailbox?: number;
  city?: string;
  phone?: string;
  alternatePhone?: string;
  breed?: string;
  color?: string;
  genderId?: number;
  gender?: string;
  animalName?: string;
  animalBirthDate?: Date;
  previousVaccinationDate?: Date;
  lastVaccinationDate?: Date;
  veterinarianName?: string;
  veterinarianLicenseNumber?: string;
  animalNumber?: number;
  animalStatusId?: number;
  animalStatus?: string;
  notificationSentDate?: Date;
  authorityID?: string;
  isActive?: boolean;
  fullAddress?: string;
  streetID?: string;
  cityName?: string;
  constructor(args: ChipsTypes) {
    this.chipID = args.chipID;
    this.chipNumber = args.chipNumber;
    this.ownerID = args.ownerID;
    this.ownerPassport = args.ownerPassport;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.addressId = args.addressId;
    this.address = args.address;
    this.streetName = args.address?.street.streetName || args.streetName;
    this.houseNumber = args.houseNumber;
    this.city = args.city;
    this.phone = args.phone;
    this.alternatePhone = args.alternatePhone;
    this.breed = args.breed;
    this.color = args.color;
    this.genderId = args.genderId;
    this.gender = args.gender;
    this.animalName = args.animalName;
    this.animalBirthDate = args.animalBirthDate;
    this.previousVaccinationDate = args.previousVaccinationDate;
    this.lastVaccinationDate = args.lastVaccinationDate;
    this.veterinarianName = args.veterinarianName;
    this.veterinarianLicenseNumber = args.veterinarianLicenseNumber;
    this.animalNumber = args.animalNumber;
    this.animalStatusId = args.animalStatusId;
    this.animalStatus = args.animalStatus;
    this.notificationSentDate = args.notificationSentDate;
    this.authorityID = args.authorityID;
    this.isActive = args.isActive;
    this.streetID = args.streetID;
    this.addressId = args.addressId;
    this.cityName = args.cityName;
  }
}

export class PlaintiffsCausesTypes {
  reservedRemarkID?: number;
  decisionCode?: number;
  parkingMailCode?: number;
  generalMailCode?: number;
  administrativeCode?: number;
  remark?: string;
  ticketType?: number;
  relatedGroup?: string;
  isPrintOnTicket?: boolean;
  isActive?: boolean;
  authorityID?: string | null | undefined;
  authorityName?: string;
  relatedGroupName?: string;
  ticketTypeID?: string;
  adminMailCode?: number;

  constructor(args: Partial<PlaintiffsCausesTypes>) {
    this.reservedRemarkID = args.reservedRemarkID;
    this.decisionCode = args.decisionCode;
    this.parkingMailCode = args.parkingMailCode || 0;
    this.generalMailCode = args.generalMailCode || 0;
    this.administrativeCode = args.administrativeCode;
    this.remark = args.remark;
    this.ticketType = args.ticketType;
    this.relatedGroup = args.relatedGroup;
    this.isPrintOnTicket = args.isPrintOnTicket ?? false; // Default to false
    this.isActive = args.isActive ?? true; // Default to true
    this.authorityID = args.authorityID;
    this.authorityName = args.authorityName;
    this.relatedGroupName = args.relatedGroupName;
    this.ticketTypeID = args.ticketTypeID;
    this.adminMailCode = args.adminMailCode || 0;
  }
}

export class SignsTypes {
  id?: string;
  signNumber?: number;
  signName?: string;
  signDescription?: string;
  isActive?: string;
  latitude?: number;
  longitude?: number;
  locationDescription?: string;
  area?: number;
  length?: number;
  width?: number;
  imagePath?: string;
  lastUpdated?: Date;

  // New fields added
  business?: {
    id?: number;
    identification?: string;
    businessName?: string;
    city?: string;
    street?: string;
    houseNumber?: string;
    entrance?: string | null;
    apartment?: string | null;
    poBox?: string | null;
    postalCode?: string | null;
    phone?: string | null;
    mobilePhone?: string | null;
    email?: string | null;
    lastUpdated?: Date;
    authorityID?: string | null;
    authority?: string | null;
    isActive?: boolean;
  };

  citizen?: {
    citizenID?: string;
    citizenCode?: number;
    nid?: string;
    passportID?: string | null;
    cn?: string | null;
    lastName?: string;
    firstName?: string;
    email?: string | null;
    isReturningResident?: boolean;
    isOverseasResident?: boolean;
    birthDate?: Date | null;
    genderID?: number | null;
    homeAddressID?: string | null;
    postalAddressID?: string | null;
    interiorMinistryHomeAddressID?: string | null;
    interiorMinistryPostalAddressID?: string | null;
    gender?: string | null;
    homeAddress?: Address | null;
    postalAddress?: string | null;
    interiorMinistryHomeAddress?: string | null;
    interiorMinistryPostalAddress?: string | null;
    citizenAddresses?: string | null;
    citizenPhones?: CitizenPhones[] | null;
    tickets?: string | null;
    lastUpdated?: Date;
    isActive?: boolean;
    authorityID?: string | null;
    authority?: string | null;
  };

  address?: {
    addressID?: string;
    streetID?: number;
    street?: {
      streetID?: number;
      streetName?: string;
      previousStreetName?: string | null;
      streetCode?: string | null;
      authorityID?: string | null;
      cityID?: number;
      cityCode?: string | null;
      areaID?: string | null;
      automationCode?: string | null;
      parkingAutomationCode?: string | null;
      businessAutomationCode?: string | null;
      isActive?: boolean;
      sendToDevice?: boolean;
      authority?: string | null;
      city?: {
        cityID?: number;
        cityName?: string;
        cityCode?: string | null;
        authorityID?: string | null;
        authorityCode?: string | null;
        authority?: string | null;
      };
      oddResidenceNumbers?: string | null;
      evenResidenceNumbers?: string | null;
      entitledTenantSignEvenNumbers?: string | null;
      entitledTenantSignOddNumbers?: string | null;
      parkingForbiddenHoursOne?: string | null;
      parkingForbiddenHoursTwo?: string | null;
      parkingForbiddenHoursThree?: string | null;
      registeringWarningReport?: boolean;
      minutesContinuousParking?: number;
      transmissionToTerminal?: boolean;
      associationSupervisionArea?: string[];
    };
    cityID?: number;
    city?: {
      cityID?: number;
      cityName?: string;
      cityCode?: string | null;
      authorityID?: string | null;
      authorityCode?: string | null;
      authority?: string | null;
    };
    houseNumber?: string | null;
    postalCode?: string | null;
    entrance?: string | null;
    apartment?: string | null;
    mailbox?: string | null;
  };

  // Constructor updated to include new fields
  constructor(args: SignsTypes) {
    this.id = args.id;
    this.signNumber = args.signNumber;
    this.signName = args.signName;
    this.signDescription = args.signDescription;
    this.isActive = args.isActive;
    this.latitude = args.latitude;
    this.longitude = args.longitude;
    this.locationDescription = args.locationDescription;
    this.area = args.area;
    this.length = args.length;
    this.width = args.width;
    this.imagePath = args.imagePath;
    this.lastUpdated = args.lastUpdated;

    // Map nested objects
    this.business = args.business;
    this.citizen = args.citizen;
    this.address = args.address;
  }
}
export class CitizenPhones {
  phone?: string;
}

export class TicketType {
  ticketTypeID: number;
  ticketTypeName: string;
}
export class ViolationsTypes {
  violationID?: string | null;
  violationCode?: number;
  violationTypeCode?: string | null;
  violationClause?: string | null;
  courtCaseTypeCode?: string | null;
  photoRequired?: boolean;
  remarkRequired?: boolean;
  canIssueWarning?: boolean;
  automationCode?: string | null;
  metropolinetCode?: string | null;
  disabledBadge?: boolean;
  isPersonalIDRequired?: boolean;
  isLicenseNumberRequired?: boolean;
  isCompanyIDRequired?: boolean;
  printCount?: number;
  createReportLater?: boolean;
  isMasofonViolation?: boolean;
  notificationCode?: number | null;
  reportType?: number | null;
  fineAmount?: number;
  section?: string | null;
  name?: string | null;
  description?: string | null;
  shortDescription?: string | null;
  authorityID?: string | null;
  ticketTypeID?: number | null;
  minimumTimeInMinutesToNextTicket?: number | null;
  authority?: string | null;
  handheldComment?: string | null;
  warningOption?: boolean;
  handheldWorkMethod?: number | null;
  ticketTypeName?: string | null;
  ticketType?: TicketType | null;
  constructor(args: ViolationsTypes) {
    this.violationID = args.violationID || null;
    this.violationCode = args.violationCode || 0;
    this.violationTypeCode = args.violationTypeCode || null;
    this.violationClause = args.violationClause || null;
    this.courtCaseTypeCode = args.courtCaseTypeCode || null;
    this.photoRequired = args.photoRequired || false;
    this.remarkRequired = args.remarkRequired || false;
    this.canIssueWarning = args.canIssueWarning || false;
    this.automationCode = args.automationCode || null;
    this.metropolinetCode = args.metropolinetCode || null;
    this.disabledBadge = args.disabledBadge || false;
    this.isPersonalIDRequired = args.isPersonalIDRequired || false;
    this.isLicenseNumberRequired = args.isLicenseNumberRequired || false;
    this.isCompanyIDRequired = args.isCompanyIDRequired || false;
    this.printCount = args.printCount || 0;
    this.createReportLater = args.createReportLater || false;
    this.isMasofonViolation = args.isMasofonViolation || false;
    this.notificationCode = args.notificationCode || 0;
    this.fineAmount = args.fineAmount || 0;
    this.section = args.section || null;
    this.name = args.name || null;
    this.description = args.description || null;
    this.shortDescription = args.shortDescription || null;
    this.authorityID = args.authorityID || null;
    this.ticketTypeID = args.ticketTypeID || 1;
    this.minimumTimeInMinutesToNextTicket =
      args.minimumTimeInMinutesToNextTicket || 0;
    this.authority = args.authority || null;
    this.handheldComment = args.handheldComment || null;
    this.warningOption = args.warningOption || false;
    this.handheldWorkMethod = args.handheldWorkMethod;
    this.ticketTypeName = args.ticketTypeName;
    this.ticketType = args.ticketType || null;
    this.reportType = args.reportType;
  }
}
export class ViolationsProcessTypes {
  violationID?: string | null;
  type?: string[];
  ViolationProcessType?: string[];
   constructor(args: ViolationsProcessTypes) {
    this.violationID = args.violationID;
    this.type = args.type;
    this.ViolationProcessType = args.ViolationProcessType;
    if(this.ViolationProcessType){
      this.type = this.ViolationProcessType;
    }
   }
}

export class BusinessType {
  id?: number;
  identification?: string;
  businessName?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  entrance?: string;
  apartment?: string;
  poBox?: string;
  postalCode?: string;
  phone?: string;
  mobilePhone?: string;
  email?: string;
  lastUpdated?: Date;
  authority?: any; // Update this type if authority has a specific structure

  constructor(args: BusinessType) {
    this.id = args.id;
    this.identification = args.identification;
    this.businessName = args.businessName;
    this.city = args.city;
    this.street = args.street;
    this.houseNumber = args.houseNumber;
    this.entrance = args.entrance;
    this.apartment = args.apartment;
    this.poBox = args.poBox;
    this.postalCode = args.postalCode;
    this.phone = args.phone;
    this.mobilePhone = args.mobilePhone;
    this.email = args.email;
    this.lastUpdated = args.lastUpdated;
    this.authority = args.authority;
  }
}

export class DeliveryMethodType {
  deliveryMethodID?: number;
  name?: string;
  authorityID?: string;
  ticketSourceID?: number;
  ticketTypeID?: number;
  ticketStageID?: number;
  ticketTypeName?: string;
  deliveryMethodName?: string;
  deliveryMethodTypeID?: string;
  constructor(args: DeliveryMethodType) {
    this.deliveryMethodID = args.deliveryMethodID;
    this.name = args.name;
    this.authorityID = args.authorityID;
    this.ticketSourceID = args.ticketSourceID;
    this.ticketTypeID = args.ticketTypeID;
    this.ticketStageID = args.ticketStageID;
    this.ticketTypeName = args.ticketTypeName;
    this.deliveryMethodName = args.deliveryMethodName;
    this.deliveryMethodTypeID = args.deliveryMethodTypeID;
  }
}
