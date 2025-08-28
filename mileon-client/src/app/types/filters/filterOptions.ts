import { SortOrder } from '../enum/sort-order.enum';

export class FilterOptions {
  searchText?: string;
  orderByField?: string;
  order?: number;
  pageSize?: number;
  currentPage: number;
  pagingCount?: number[];
  startDate?: Date;
  endDate?: Date;
  customFilters?: number[];
  authorityID?: string;

  constructor(options?: FilterOptions | null) {
    this.searchText = options?.searchText || '';
    this.order = options?.order || SortOrder.asc;
    this.currentPage = options?.currentPage || 1;
    this.pageSize = options?.pageSize || 100;
    this.orderByField = options?.orderByField || '';
    this.startDate = options?.startDate || undefined;
    this.endDate = options?.endDate || undefined;
    this.customFilters = options?.customFilters || undefined;
  }
}
