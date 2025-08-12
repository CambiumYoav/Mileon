import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, EMPTY, Observable, switchMap, throwError } from 'rxjs';
import { PermissionService } from '../services/permission.service';
import { HttpService } from '../services/http.service';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../types/token.interface';
import { AuthService } from '../services/auth.service';
import { SessionService } from '../services/session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private permissionService: PermissionService,
    private httpService: HttpService,
    private authService: AuthService,
    private sessionService: SessionService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.permissionService.jwtToken;
    const exp = this.permissionService.tokenExpiration;

    // ✅ Skip intercepting the refresh token request itself
    if (request.url.includes('/Auth/refresh')) {
      return next.handle(request);
    }

    if (this.isTokenExpired(exp())) {
      if (this.isWithinGracePeriod(exp())) {
        // ✅ Perform refresh token request
        return this.authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            const decoded: DecodedToken = jwtDecode(newToken);
            this.sessionService.set('token', newToken);
            this.permissionService.setTokenAfterRefresh(newToken, decoded.exp);

            // ✅ Clone and retry original request with new token
            const clonedRequest = request.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
            });

            return next.handle(clonedRequest);
          }),
          catchError(() => {
            this.authService.logout();
            return throwError(() => new Error('Token refresh failed'));
          })
        );
      } else {
        if (this.permissionService.hasToken()) {
          this.authService.logout();
          return throwError(
            () => new Error('Token expired beyond grace period')
          );
        }
      }
    }

    // ✅ Attach token if it's valid
    if (token) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 403 &&
          error.error === 'User cant access the route'
        ) {
          this.httpService.handleError(error);
        }
        if (error.status === 401) {
          this.httpService.handleError(error);
        }
        return throwError(() => new Error(error.message));
      })
    );
  }

  private isTokenExpired(exp: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return currentTimestamp > exp;
    // return false;
  }

  // private isWithinGracePeriod(exp: number): boolean {
  //   const currentTimestamp = Math.floor(Date.now() / 1000);
  //   return currentTimestamp <= exp + 300; // 5-minute grace period
  // }
  private isWithinGracePeriod(exp: number): boolean {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return currentTimestamp <= exp + 3600; // 60-minute grace period
  }
}
