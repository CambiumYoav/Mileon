import { Injectable, signal, effect, OnDestroy } from '@angular/core';
import { Router, Params } from '@angular/router';
import { Location } from '@angular/common';
import { RoleEnum } from '../types/enum/moduleEnum';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class RouterService implements OnDestroy {
  role: RoleEnum = RoleEnum.DISPATCHER;
  private navigationUrl = signal<string>('');
  private isNavigating = signal<boolean>(false);
  private debounceTimer: any = null;
  private lastNavigationTime = 0;
  private lastNavigatedUrl = '';
  private readonly NAVIGATION_THROTTLE_MS = 300; // Increased throttle time

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
  ) {
    // Set up navigation throttling using signals with improved debounce
    effect(() => {
      const url = this.navigationUrl();
      const navigating = this.isNavigating();
      
      if (url && !navigating && url !== this.lastNavigatedUrl) {
        const now = Date.now();
        const timeSinceLastNavigation = now - this.lastNavigationTime;
        
        // If enough time has passed since last navigation, navigate immediately
        if (timeSinceLastNavigation >= this.NAVIGATION_THROTTLE_MS) {
          this.performNavigation(url);
        } else {
          // Clear existing timer
          if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
          }
          
          // Set new debounced navigation
          const remainingTime = this.NAVIGATION_THROTTLE_MS - timeSinceLastNavigation;
          this.debounceTimer = setTimeout(() => {
            this.performNavigation(url);
          }, remainingTime);
        }
      }
    });
  }

  getCurrentUrl(): string {
    return this.router.routerState.snapshot.url;
  }

  private performNavigation(url: string): void {
    this.isNavigating.set(true);
    this.lastNavigationTime = Date.now();
    this.lastNavigatedUrl = url;
    
    this.router.navigateByUrl(url).finally(() => {
      this.isNavigating.set(false);
    });
  }

  navigateTo(
    url: string,
    id?: string,
    queryParams?: {}
  ): Promise<boolean> | undefined | void {
    const currentUrl = this.snapshot.url;
    let fullUrl = currentUrl + '/' + url;
    
    if (id) {
      fullUrl = fullUrl + '/' + id;
    }
    
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams as any).toString();
      fullUrl = fullUrl + '?' + queryString;
    }
    
    this.navigationUrl.set(fullUrl);
    return Promise.resolve(true);
  }

  getRole() {
    return this.permissionService.role();
  }

  navigateToSetUrl(url: string) {
    this.navigationUrl.set(`/${url}`);
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
    
    // Use throttled navigation to prevent rapid navigation requests
    this.navigationUrl.set(fullUrl);
    return Promise.resolve(true);
  }

  back(): void {
    this.location.back();
  }

  navigateToPageURL(pageRoute: string): void {
    const role = this.getRole();
    if (role) {
      const fullPath = `/main/${role}/${pageRoute}`;
      this.navigationUrl.set(fullPath);
    }
  }

  navigateToRoleEnv(): Promise<boolean> | void {
    const role = this.getRole();
    if (role) {
      const fullPath = `/main/${role}`;
      // navigate to another Role environment
      this.navigationUrl.set(fullPath);
      return Promise.resolve(true);
    }
    return;
  }
  navigateToLogin(url: string, id?: string, queryParams?: {}) {
    let fullUrl = url;
    
    if (id) {
      fullUrl = fullUrl + '/' + id;
    }
    
    if (queryParams) {
      const queryString = new URLSearchParams(queryParams as any).toString();
      fullUrl = fullUrl + '?' + queryString;
    }
    
    this.navigationUrl.set(fullUrl);
    return Promise.resolve(true);
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

  ngOnDestroy(): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  }

  // Method to reset navigation state if needed
  resetNavigationState(): void {
    this.isNavigating.set(false);
    this.lastNavigationTime = 0;
    this.lastNavigatedUrl = '';
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
      this.debounceTimer = null;
    }
  }
}
