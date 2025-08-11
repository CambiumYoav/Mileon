export class Summary {
  groupedListName: string;
  summaryTotal: number;
  summaryGroups: SummaryGroup[];
}

export class SummaryGroup {
  groupName: string;
  totalSummary: number;
  summaryItems: SummaryItem[];
}

export class SummaryItem {
  name: string;
  counter: number;
  filter: number;
}

export class SummaryFilteredItem {
  name: string;
  customFilters: number[];
}

export class SummaryTotal {
  ticketsTotal: number;
  parkingPermitsTotal: number;
  legalRequestsTotal: number;
}
