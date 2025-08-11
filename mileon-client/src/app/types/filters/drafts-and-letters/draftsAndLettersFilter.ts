import { FilterOptions } from '../filterOptions';

export class DraftsAndLettersFilterOptions extends FilterOptions {
  public isActive?: boolean;

  constructor(args?: Partial<DraftsAndLettersFilterOptions>) {
    super();

    if (args) {
      Object.assign(this, args);
    }
  }
}
