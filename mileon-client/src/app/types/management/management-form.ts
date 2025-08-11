export class authorityManagementForm {
  authorityID?: string;
  authorityName?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
  facebookLink?: string;
  instagramLink?: string;
  twitterLink?: string;
  telegramLink?: string;
  tiktokLink?: string;
  portalSubDomain?: string;
  address?: AddressWithoutID;
  cityName?: string;
  cityID?: string;
  entrance?: string;
  houseNumber?: string;
  mailbox?: string;
  // streetName?: string;
  streetID?: string;
  constructor(args: authorityManagementForm) {
    this.authorityID = args.authorityID;
    this.authorityName = args.authorityName;
    this.logoUrl = args.logoUrl;
    this.phone = args.phone;
    this.email = args.email;
    this.facebookLink = args.facebookLink;
    this.instagramLink = args.instagramLink;
    this.twitterLink = args.twitterLink;
    this.telegramLink = args.telegramLink;
    this.tiktokLink = args.tiktokLink;
    this.portalSubDomain = args.portalSubDomain;

    this.address = args.address;

    this.cityName = args.cityName;
    this.cityID = args.cityID;
    this.entrance = args.entrance;
    this.houseNumber = args.houseNumber;
    this.mailbox = args.mailbox;
    // this.streetName = args.streetName;
    this.streetID = args.streetID;
  }
}

export const authorityFormValidation = [];

export class AddressWithoutID {
  apartment: string = '';
  areaID: number | null;
  areaName: string = '';
  fullAddress?: string;
  cityID: string;
  cityName: string = '';
  entrance: string = '';
  houseNumber: number | undefined = undefined;
  mailbox: string = '';
  postalCode: string = '';
  streetID: number | undefined = undefined;
  streetName: string = '';
}
