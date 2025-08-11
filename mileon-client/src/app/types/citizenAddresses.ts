import { Address } from './address';

export class CitizenAddress {
  address: Address = new Address();
  addressTypeID: number;
  isEditable: boolean = true;
  isMain: boolean;

  constructor(args?: CitizenAddress) {
    if (args) {
      this.address = new Address(args.address);
      this.addressTypeID = args.addressTypeID;
      this.isEditable = args.isEditable;
      this.isMain = args.isMain;
    }
  }
}

