import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private permissionService = inject(PermissionService);
  private routerService = inject(RouterService);
  constructor() {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    if (this.permissionService.hasToken()) {
      console.log(this.permissionService.hasToken());
      return true; // Allow access
    } else {
      // Redirect to login
      this.routerService.navigateTo('/login');
      return false; // Block access
    }
  }
}
