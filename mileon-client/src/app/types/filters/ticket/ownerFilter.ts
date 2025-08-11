import { FilterOptions } from "../filterOptions";

export interface OwnerFilter extends FilterOptions {
    nid?: string,
    cn?: string,
    passportID?: string,
    vehicleNumber?: number
}