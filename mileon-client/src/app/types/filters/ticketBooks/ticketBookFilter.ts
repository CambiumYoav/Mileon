import { FilterOptions } from '../filterOptions';

export class TicketBookFilterOptions extends FilterOptions {
  public seriesNumber?: number;
  public inUse?: boolean;
  public bookNumber?: number;
  public ticketTypeID?: number;
  public ticketBookStatusID?: number;
  public ticketNumberInBook?: string;
  public inspectorID?: string;
  public inspectorName?: string;
  public fromSeriesNumber?: number;
  public toSeriesNumber?: number;
  public fromBookNumber?: number;
  public toBookNumber?: number;
  

  constructor(args?: Partial<TicketBookFilterOptions>) {
    super();

    if (args) {
      Object.assign(this, args);
    }
  }
}
