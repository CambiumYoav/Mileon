import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { RouterService } from './router.service';
import { ROUTE_PATH as RP } from '../constants/routerPath';

@Injectable({
  providedIn: 'root',
})
export class ModeDetectionService {
  private router = inject(Router);
  private routerService = inject(RouterService);
  private sessionService = inject(SessionService);

  constructor() {}

  detectAndSetMode(componentName?: string): boolean {
    const currentUrl = this.router.url;
    const isEditMode = currentUrl.includes('/edit');

    // Store in session
    this.sessionService.set('isEditMode', isEditMode);
    this.sessionService.set('currentMode', isEditMode ? 'edit' : 'create');

    return isEditMode;
  }

  getCurrentMode(): boolean {
    return this.sessionService.get('isEditMode') || false;
  }

  navigateToNext(routePath: string): void {
    const isEditMode = this.getCurrentMode();
    const baseRoute = RP.Management.Home;

    if (isEditMode) {
      this.routerService.navigateToPageURL(`${baseRoute}/edit/${routePath}`);
    } else {
      this.routerService.navigateToPageURL(`${baseRoute}/create/${routePath}`);
    }
  }

  clearMode(): void {
    this.sessionService.remove('isEditMode');
    this.sessionService.remove('currentMode');
  }
}
