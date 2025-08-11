export class TerminalInspectorsFilterOptions {
  order: number;
  currentPage: number;
  orderByField: string;
  pageSize: number;
  authorityID: string;
  constructor(args: TerminalInspectorsFilterOptions) {
    Object.assign(this, args);
  }
}
