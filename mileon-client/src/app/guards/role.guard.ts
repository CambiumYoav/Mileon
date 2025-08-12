import { inject, Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import log from '../utils/log';
import { RouterService } from '../services/router.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
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
    const { expectedRole } = route.data;
    console.log(route)
    console.log(this.permissionService.hasRole(expectedRole));
    if (expectedRole && this.permissionService.hasRole(expectedRole)) {
      log(`route approved for ${expectedRole}`);
      return true; // Allow access
    } else {
      log(`route blocked for ${expectedRole}`);
      // Redirect to a default page or login
      this.routerService.navigateTo('/login');
      return false; // Block access
    }
  }
}
