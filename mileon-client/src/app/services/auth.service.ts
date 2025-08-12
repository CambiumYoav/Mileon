import { SessionService } from './session.service';
import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpService } from './http.service';
import { User, UserLogin } from '../types/user';
import { Permission, TokenWithPermission } from '../types/permission.interface';
import { catchError, lastValueFrom, map, Observable, throwError } from 'rxjs';
import { DecodedToken } from '../types/token.interface';
import { jwtDecode } from 'jwt-decode';
import { PermissionService } from './permission.service';
import { RouterService } from './router.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiController = 'Auth';
  //  jwtHelper = inject(JwtHelperService);
  private routerService = inject(RouterService);
  private sessionService = inject(SessionService);
  private httpService = inject(HttpService);
  private permissionService = inject(PermissionService);

  constructor() {}

  login(userLogin: UserLogin): Observable<TokenWithPermission> | null {
    const url = `client/${this.apiController}/login`;
    return this.httpService.postRequest(url, userLogin).pipe(
      catchError(this.httpService.handleError) // Only catchError without displaying a success toast
    );
  }

  getPermission() {
    this.sessionService.remove('token');
    const url = `${this.apiController}/getPermissions`;
    this.httpService.getRequest(url);
    this.routerService.navigateToUrl(['login']);
  }

  logout() {
    this.sessionService.remove('token');
    this.sessionService.remove('permission');
    this.routerService.navigateToLogin('/login');
    this.permissionService.reset();
  }

  refreshToken() {
    try {
      let token = this.jwtToken;
      if (token) {
        const url = `client/${this.apiController}/refresh`;
        return this.httpService
          .postRequest<{ token: string }>(url, token)
          .pipe(map((response) => response.token));
      } else {
        return throwError(() => new Error('No token found'));
      }
    } catch (error) {
      return throwError(() => new Error('Token refresh failed'));
    }
  }
  get jwtToken(): string | null {
    return this.sessionService.getToken('token');
  }

  getUser(): User | null {
    if (this.jwtToken) {
      const decodedToken: DecodedToken | null = jwtDecode(this.jwtToken);
      return decodedToken;
    }
    return null;
  }

  forgotPassword(body = {}) {
    const res = this.httpService.postRequest(
      `client/${this.apiController}/password/forgot `,
      body
    );

    return lastValueFrom(res);
  }

  resetPassword(body = {}) {
    const res = this.httpService.postRequest(
      `client/${this.apiController}/password/reset `,
      body
    );

    return lastValueFrom(res);
  }

  updatePassword(body = {}) {
    const res = this.httpService.postRequest(
      `client/${this.apiController}/password/update `,

      body
    );

    return lastValueFrom(res);
  }
}
