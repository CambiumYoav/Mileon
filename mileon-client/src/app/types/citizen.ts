import { Address } from './address';
import { CitizenPhone } from './citizenPhones';

export class Citizen {
  citizenID?: string;
  citizenPhones?: CitizenPhone[];
  email?: string;
  firstName: string = '';
  lastName: string = '';
  fullName?: string;
  nid?: string;
  cn?: string;
  passportID?: string;
  isReturningResident?: boolean;
  isOverseasResident?: boolean;
  isSeniorCitizen?: boolean;
  birthDate?: Date;
  genderID?: number;
  homeAddress: Address = new Address(); //כתובת מגורים
  postalAddress: Address = new Address(); //כתובת למשלוח דואר
  interiorMinistryHomeAddress?: Address; //כתובת מגורים משרד הפנים
  interiorMinistryPostalAddress?: Address; //כתובת דואר ממשרד הפנים
  city?: string;
  constructor(args: Citizen) {
    Object.assign(this, args);
    this.fullName = (this.firstName || '') + ' ' + (this.lastName || '');
    if (this.homeAddress) {
      this.homeAddress = new Address(args.homeAddress);
    }
    if (this.postalAddress) {
      this.postalAddress = new Address(args.postalAddress);
    }
  }
}
