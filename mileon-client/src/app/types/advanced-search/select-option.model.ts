import { FilterOptions } from '../filters/filterOptions';

export interface SelectParams extends FilterOptions {
  authorityIDs?: string[];
  cityIDs?: string[];
  ids?: string[] | number[];
  bankCodes?: number[];
  streetsIDs?: string[];
  TypeId?: number; //templateTypeIDs
}
