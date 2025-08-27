import { ColorsHex } from "./enum/colors.enum";

export interface StatusType {
    [key: string]: Status;
}

export interface Status {
    [key: number]: StatusAttributes;
}

export interface StatusAttributes {
    bgColor: ColorsHex;
    textColor: ColorsHex;
}