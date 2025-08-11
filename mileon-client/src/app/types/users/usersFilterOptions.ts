import { FilterOptions } from '../filters/filterOptions';

export class UsersFilterOptions extends FilterOptions {
  isActive?: boolean;
  constructor(options?: UsersFilterOptions | null) {
    super();
    this.isActive = options?.isActive;
  }
}
