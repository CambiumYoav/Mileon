import { FilterOptions } from '../filterOptions';
import { InterfaceFilter } from '../ticket/ticketFilterOptionsNew';
export class ProductionTicketsFilterOptions extends FilterOptions {
  interfaceFilter?: InterfaceFilter;
  ticketNumber: string;
  userId:string;
  templateId: string;
  fromDate:Date | any;
  toDate:Date| any;
  constructor(args: ProductionTicketsFilterOptions) {
    super();
    this.ticketNumber = args.ticketNumber;
    this.authorityID = args.authorityID;
    this.templateId=args.templateId;
    this.userId = args.userId;
    this.fromDate=args.fromDate;
    this.toDate=args.toDate;
    this.interfaceFilter = args?.interfaceFilter || new InterfaceFilter({});
  }
}
