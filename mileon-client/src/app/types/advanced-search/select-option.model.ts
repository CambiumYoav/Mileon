import { FilterOptions } from '../filters/filterOptions';

export interface SelectParams extends FilterOptions {
  readonly authorityIDs?: readonly string[];
  readonly cityIDs?: readonly string[];
  ids?: (string | number)[];
  readonly bankCodes?: readonly number[];
  readonly streetsIDs?: readonly string[];
  readonly TypeId?: number; //templateTypeIDs
}
