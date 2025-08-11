import { Utils } from 'src/app/utils/utils';
import { Address } from '../address';
import { Citizen } from '../citizen';
import { Vehicle } from '../vehicle';

export class ParkingPermit {
  parkingPermitID: string;
  parkingPermitNumber: number;
  parkingPermitStatus: ParkingPermitStatus;
  requestDate: Date;
  approvalDate: Date;
  parkingPermitAreas: string[];
  parkingPermitAreasString: string;
  startDate: Date;
  expirationDate: Date;
  permitTypeID: number;
  permitTypeName: string;
  sendReminderWhenExpired: boolean;
  sendPermitWithPost: boolean;
  paymentID: number;
  renewalReasonID: number;
  authorityID: string;
  createdByUserID: number;
  requestSourceID: number;
  address: Address;
  vehicle: Vehicle;
  citizen: Citizen;
  cost: number;
  authorityName: string;

  constructor(args?: any, flat: boolean = false) {
    if (args && typeof args === 'object') {
      //   Object.assign(this, args);
      args.citizen = new Citizen(args.citizen);
      args.address = new Address(args.address);
      for (let key of Object.keys(args)) {
        // format date:
        if (
          isNaN(args[key]) &&
          new Date(args[key]).toString() !== 'Invalid Date'
        ) {
          args[key] = new Date(args[key]).toLocaleDateString('he-IL');
        }

      }
      if (flat) {
        const flattened = Utils.flattenObject(args);
        Object.assign(this, flattened);
      } else {
        Object.assign(this, args);
      }
      this.parkingPermitAreasString = args.parkingPermitAreas.join(',');
    }
  }

}

class ParkingPermitStatus{
  name: string;
  id: number;
}
