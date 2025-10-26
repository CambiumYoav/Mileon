import { Injectable } from '@angular/core';
import { AuthorityManagementService } from '../components/authority-management/authority-management.service';
import { SystemFieldModuleEnum } from '../types/enum/systemFiledEnum';

export interface SystemFieldDto {
  id: string;
  displayName: string;
}

export interface SearchResult<T> {
  list: T[];
  count: number;
  total: number;
}
@Injectable({
  providedIn: 'root',
})
export class MentionService {
  private debounce?: any;
  private cache = new Map<string, SearchResult<SystemFieldDto>>();

  constructor(private authorityManagementService: AuthorityManagementService) {}

  /**
   * מחפש שדות מערכת ל-mention לפי מודול, טקסט, עמוד וגודל עמוד.
   * מחזיר Promise שמתאים ל-CKEditor mention feed.
   */
  searchSystemFields(
    searchText: string,
    moduleId?: SystemFieldModuleEnum,
    currentPage = 1,
    pageSize = 5
  ): Promise<{ list: SystemFieldDto[]; count: number; total: number }> {
    if (this.debounce) clearTimeout(this.debounce);

    return new Promise((resolve, reject) => {
      this.debounce = setTimeout(async () => {
        try {
          const body = {
            searchText: searchText || '',
            customFilters: moduleId != null ? [moduleId] : [],
            orderByField: 'string',
            order: 0,
            currentPage,
            pageCount: 0,
            pageSize,
          };

          const res = await this.authorityManagementService.getSystemFields(  
            moduleId,
            body
          );
          resolve(res);
        } catch (err) {
          reject(err);
        }
      }, 250);
    });
  }
}
