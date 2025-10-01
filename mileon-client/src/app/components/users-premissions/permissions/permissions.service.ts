import { inject, Injectable, signal, computed } from '@angular/core';
import { lastValueFrom, Observable } from 'rxjs'; 
import { HttpService } from '../../../services/http.service';      
import { FilterOptions } from '../../../types/filters/filterOptions';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private readonly apiController = 'Group';
  private readonly httpService = inject(HttpService);

  // Signals for reactive state
  private modulesData = signal<any[]>([]);
  private loading = signal<boolean>(false);
  private error = signal<string | null>(null);

  // Computed signals
  modules = computed(() => this.modulesData());
  isLoading = computed(() => this.loading());
  hasError = computed(() => this.error() !== null);
  errorMessage = computed(() => this.error());

  getGroups(filters: FilterOptions): Promise<any> {
    const queryParams = this.buildQueryParams(filters);
    const queryString = queryParams.length ? `?${queryParams.join('&')}` : '';
    
    const request$ = this.httpService.getRequest(
      `${this.apiController}/GetGroups${queryString}`
    );
    
    return lastValueFrom(request$);
  }

  createGroup(body: Record<string, any> = {}): Promise<any> {
    const request$ = this.httpService.postRequest(
      `${this.apiController}/CreateGroup`,
      body
    );
    return lastValueFrom(request$);
  }

  deleteGroup(groupId: string): Promise<any> {
    const request$ = this.httpService.deleteRequest(
      `${this.apiController}/DeleteGroup/${groupId}`
    );
    return lastValueFrom(request$);
  }

  getModules(groupId: number): Promise<any> {
    const request$ = this.httpService.getRequest(
      `${this.apiController}/GetModules/${groupId}`
    );
    return lastValueFrom(request$);
  }

  // Signal-based methods
  async loadModules(groupId: number): Promise<void> {
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const res = await this.getModules(groupId);
      if (res) {
        this.modulesData.set(res);
      }
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'An error occurred');
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }

  updateModulePermission(moduleId: number, permission: string, value: boolean): void {
    const currentModules = this.modulesData();
    const updatedModules = currentModules.map(module => {
      if (module.moduleId === moduleId) {
        return { ...module, [permission]: value };
      }
      return module;
    });
    this.modulesData.set(updatedModules);
  }

  updatePermissions(groupId: number, body: Record<string, any> = {}): Promise<any> {
    const request$ = this.httpService.postRequest(
      `${this.apiController}/UpdatePermissions/${groupId}`,
      body
    );
    return lastValueFrom(request$);
  }

  private buildQueryParams(filters: FilterOptions): string[] {
    const queryParams: string[] = [];

    if (filters.currentPage) {
      queryParams.push(`page=${filters.currentPage}`);
    }

    if (filters.pageSize) {
      queryParams.push(`size=${filters.pageSize}`);
    }

    if (filters.searchText) {
      queryParams.push(`search=${filters.searchText}`);
    }

    if (filters.authorityID) {
      queryParams.push(`authorityID=${filters.authorityID}`);
    }

    return queryParams;
  }
}
