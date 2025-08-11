import { FilterOptions } from '../filters/filterOptions';

export class UsersPermissionsFilterOptions extends FilterOptions {
  SearchText?: string; //?
  areaName?: string;

  constructor(options?: UsersPermissionsFilterOptions | null) {
    super();
    this.SearchText = options?.SearchText;
    this.areaName = options?.areaName;
  }
}
