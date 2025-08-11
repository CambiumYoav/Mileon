import { ColorsHex } from "./enum/colors.enum";

export interface StatusType {
    [key: string]: Status;
}

export interface Status {
    [key: number]: StatusAttributes;
}

export class StatusAttributes {
    bgColor: ColorsHex;
    textColor: ColorsHex;
}

type StatusOptions = 'Active' | 'NotActive' | 'Bakasha';