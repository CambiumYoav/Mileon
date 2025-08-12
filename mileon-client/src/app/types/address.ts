export class Address {
  addressID: number | null = null;
  apartment: string = '';
  areaID: number | null = null;
  areaName: string = '';
  fullAddress?: string;
  cityID: number | undefined = undefined;
  cityName: string = '';
  entrance: string = '';
  houseNumber: number | undefined = undefined;
  mailbox: string = '';
  postalCode: string = '';
  streetID: number | undefined = undefined;
  streetName: string = '';

  constructor(args?: Address) {
    if (args) {
      Object.assign(this, args);
      this.fullAddress =
        (this.streetName || '') +
        ' ' +
        (this.houseNumber || '') +
        ' ' +
        (this.cityName || '');
    }
  }
}
