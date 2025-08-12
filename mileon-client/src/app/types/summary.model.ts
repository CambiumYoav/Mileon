export class Summary {
  groupedListName: string = '';
  summaryTotal: number = 0;
  summaryGroups: SummaryGroup[] = [];
}

export class SummaryGroup {
  groupName: string = '';
  totalSummary: number = 0;
  summaryItems: SummaryItem[] = [];
}

export class SummaryItem {
  name: string = '';
  counter: number = 0;
  filter: number = 0;
}

export class SummaryFilteredItem {
  name: string = '';
  customFilters: number[] = [];
}

export class SummaryTotal {
  ticketsTotal: number = 0;
  parkingPermitsTotal: number = 0;
  legalRequestsTotal: number = 0;
}
