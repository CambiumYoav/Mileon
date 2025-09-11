import { Injectable } from '@angular/core';
import { Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { RoleEnum } from '../types/enum/moduleEnum';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService {
  role: RoleEnum = RoleEnum.DISPATCHER;

  get queryParams() {
    return this.router.routerState.root.queryParams;
  }

  get snapshot() {
    return this.router.routerState.snapshot;
  }

  get data() {
    return this.router.routerState.root.data;
  }

  constructor(
    private router: Router,
    private location: Location,
    public permissionService: PermissionService
  ) {}

  getCurrentUrl(): string {
    return this.router.routerState.snapshot.url;
  }

  navigateTo(
    url: string,
    id?: string,
    queryParams?: {}
  ): Promise<boolean> | undefined | void {
    const currentUrl = this.snapshot.url;
    const fullUrl = currentUrl + '/' + url;
    if (queryParams) {
      return this.router.navigate([fullUrl, id], {
        queryParams: queryParams,
        // replaceUrl: true,
      });
    } else if (id) {
      return this.router.navigate([fullUrl, id]);
    } else {
      this.router.navigate([fullUrl]);
    }
  }

  getRole() {
    return this.permissionService.role();
  }

  navigateToSetUrl(url: string) {
    this.router.navigate([`/${url}`]);
  }

  navigateToUrl(
    urlSections: string[],
    fromHome: boolean = false,
    state: Object = {},
    queryParams?: Params[]
  ): Promise<boolean> | undefined | void {
    const role = this.getRole();
    if (!role) return this.navigateTo('/login');
    
    // Build the full URL with role prefix
    let fullUrl = `/main/${role}`;
    if (urlSections?.length) {
      fullUrl = this.removeTrailingSlash(fullUrl + '/' + urlSections.join('/'));
    }
    
    if (queryParams) {
      fullUrl = fullUrl + this.buildQueryParams(queryParams);
    }
    
    return this.router.navigateByUrl(fullUrl, { state });
  }

  back(): void {
    this.location.back();
  }

  navigateToPageURL(pageRoute: string): void {
    const role = this.getRole();
    if (role) {
      const fullPath = `/main/${role}/${pageRoute}`;
      this.router.navigate([fullPath]);
    }
  }

  navigateToRoleEnv(): Promise<boolean> | void {
    const role = this.getRole();
    if (role) {
      const fullPath = `/main/${role}`;
      // navigate to another Role environment
      return this.router.navigateByUrl(fullPath, {
        replaceUrl: true,
        // skipLocationChange: true,
      });
    }
    return;
  }
  navigateToLogin(url: string, id?: string, queryParams?: {}) {
    const navigation = id ? [url, id] : [url];

    return this.router.navigate(navigation, {
      queryParams,
    });
  }

  getCurrentState(): any {
    return window.history.state;
  }

  private removeTrailingSlash(input: string): string {
    // clean last slash to prevent broken navigation
    if (input.endsWith('/')) {
      return input.slice(0, -1); // Remove the last character
    }
    return input;
  }

  private buildQueryParams(paramsArray: Params[]) {
    if (!paramsArray || paramsArray.length === 0) {
      return '';
    }

    const queryParams = new URLSearchParams();

    paramsArray.forEach((params) => {
      Object.keys(params).forEach((key) => {
        queryParams.append(key, params[key]);
      });
    });

    return '?' + queryParams.toString();
  }
}
