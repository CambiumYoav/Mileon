// import { inject, Injectable } from '@angular/core';
// import { SessionService } from './session.service';
// import { jwtDecode } from 'jwt-decode';
// import {
//   FullPermission,
//   Module,
//   Options,
//   Permission,
//   Route,
// } from '../types/permission.interface';
// import { BehaviorSubject, Observable } from 'rxjs';
// import { DecodedToken } from '../types/token.interface';

// @Injectable({
//   providedIn: 'root',
// })
// export class PermissionService {
//   public sessionService = inject(SessionService);
//   private permissionSubject: BehaviorSubject<Permission | null> =
//     new BehaviorSubject<Permission | null>(null);
//   tokenExpiration: number = 0;
//   private _role: string | null = null;
//   private _modules: { [key: string]: Module } = {};
//   private _routes: { [key: string]: Route } = {};
//   private _options: Options | null = null;
//   private _isActive: boolean = false;
//   private userName: string = '';
//   public email: string = '';
//   public authority: string = '';
//   private isSuperAdmin: boolean = false;

//   constructor() {
//     this.initializePermissions();
//   }

//   private initializePermissions() {
//     const decodedToken = this.getDecodedAccessToken();
//     const permission = this.getPermissionFromSession();
//     if (decodedToken && permission) {
//       const { role, IsAdmin, exp } = decodedToken;
//       this.tokenExpiration = exp;
//       this.setPermission({ role, ...permission });
//       const firstName = decodedToken.firstName;
//       const lastName = decodedToken.lastName;
//       this.isSuperAdmin = IsAdmin;

//       // Combine into userName
//       this.userName = `${firstName} ${lastName}`;
//       this.email = decodedToken.email;
//       this.authority = decodedToken.authority;
//     } else {
//       this.sessionService.remove('token');
//     }
//   }

//   reset() {
//     this.tokenExpiration = 0;
//     this.permissionSubject.next(null);
//     this.isSuperAdmin = false;

//     // Combine into userName
//     this.userName = '';
//     this.email = '';
//     this.authority = '';
//   }

//   getPermissionFromSession(): Permission | null {
//     return this.sessionService.get<Permission>('permission');
//   }

//   private setPermission(fullPermission: FullPermission) {
//     this.permissionSubject.next(fullPermission);
//     this.parsePermission(fullPermission);
//   }

//   getPermission(): Observable<Permission | null> {
//     return this.permissionSubject.asObservable();
//   }

//   getUserName(): string {
//     return this.userName;
//   }
//   getUserEmail(): string {
//     return this.email;
//   }
//   getUserAuthority(): string {
//     return this.authority;
//   }

//   private parsePermission(permission: FullPermission) {
//     this._role = permission.role;
//     this._options = permission.options;

//     this._modules = {};
//     this._routes = {};

//     permission.modules.forEach((module) => {
//       this._modules[module.id] = module;
//       this._routes[module.id] = {
//         id: module.id,
//         path: module.route.path,
//         isRead: true,
//       };
//     });
//   }

//   get role(): string | null {
//     return this._role;
//   }

//   get modules(): { [key: string]: Module } {
//     return this._modules;
//   }

//   get routes(): { [key: string]: Route } {
//     return this._routes;
//   }

//   get options(): Options | null {
//     return this._options;
//   }

//   get isActive(): boolean {
//     return this._isActive;
//   }

//   get isAdmin(): boolean {
//     return (this.isSuperAdmin + '').toLocaleLowerCase() == 'true';
//   }

//   // Check if the current role matches the expected role
//   hasRole(expectedRole: string): boolean {
//     return (this.role && this.role === expectedRole) || false;
//   }

//   hasModule(moduleId: string): boolean {
//     return !!this._modules[moduleId];
//   }

//   hasRoute(path: string): boolean {
//     return !!this._routes[path];
//   }

//   canAccessRoute(path: string): boolean {
//     return this._routes[path]?.isRead || false;
//   }

//   get jwtToken(): string | null {
//     return this.sessionService.getToken('token');
//   }

//   public hasToken(): boolean {
//     const token = this.jwtToken;
//     return !!token;
//   }

//   private getDecodedAccessToken(): DecodedToken | null {
//     try {
//       if (this.jwtToken) {
//         return jwtDecode(this.jwtToken);
//       } else return null;
//     } catch (err) {
//       console.error('Error decoding access token', err);
//       return null;
//     }
//   }

//   refreshPermissions() {
//     this.initializePermissions();
//   }

//   checkUserPermission(expectedRoute: string): boolean {
//     const permissions = this.getPermissionFromSession();
//     if (permissions) {
//       return JSON.stringify(permissions?.modules)?.includes(expectedRoute);
//     }
//     return true;
//   }

//   checkUserPagePermission(expectedRoutes: string[]): boolean {
//     if (expectedRoutes.length === 0) return true;
//     const permissions = this.getPermissionFromSession();
//     let state = false;
//     expectedRoutes.forEach((route: string) => {
//       if (JSON.stringify(permissions?.modules)?.includes(route)) {
//         state = true;
//       }
//     });
//     return state;
//   }
// }
import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { SessionService } from './session.service';
import { jwtDecode } from 'jwt-decode';
import {
  FullPermission,
  Module,
  Options,
  Permission,
  Route,
} from '../types/permission.interface';
import { DecodedToken } from '../types/token.interface';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class PermissionService {
  private session = inject(SessionService);

  // --- core signals ---
  private _permission = signal<Permission | null>(null);
  private _tokenExp = signal<number>(0);
  private _role = signal<string | null>(null);
  private _modules = signal<{ [key: string]: Module }>({});
  private _routes = signal<{ [key: string]: Route }>({});
  private _options = signal<Options | null>(null);
  private _isActive = signal<boolean>(false);

  private _userName = signal<string>('');
  private _userId = signal<string>('');
  private _email = signal<string>('');
  private _authority = signal<string>('');
  private _isSuperAdmin = signal<boolean>(false);

  // --- public readonly signals (selectors) ---
  permission = this._permission.asReadonly();
  tokenExpiration = this._tokenExp.asReadonly();
  role = this._role.asReadonly();
  modules = this._modules.asReadonly();
  routes = this._routes.asReadonly();
  options = this._options.asReadonly();
  isActive = this._isActive.asReadonly();

  userName = this._userName.asReadonly();
  userId = this._userId.asReadonly();
  email = this._email.asReadonly();
  authority = this._authority.asReadonly();
  isAdmin = computed(() => this._isSuperAdmin());

  // Optional: observable for any legacy consumers
  permission$ = toObservable(this.permission);

  constructor() {
    this.initializePermissions();

    // Example: effect to auto-logout when token expired (optional)
    // effect(() => {
    //   const exp = this._tokenExp();
    //   if (exp && Date.now() / 1000 > exp) {
    //     this.reset();
    //     this.session.remove('token');
    //   }
    // });
  }

  // ------- init / refresh -------
  private initializePermissions(): void {
    const decoded = this.getDecodedAccessToken();
    const permission = this.getPermissionFromSession();

    if (decoded && permission) {
      const {
        role,
        IsAdmin,
        exp,
        firstName,
        lastName,
        email,
        authority,
        UserId,
      } = decoded;
      console.log(role);
      this._tokenExp.set(exp);
      this.setPermission({ role, ...permission }); // also parses modules/routes/options

      this._isSuperAdmin.set(!!IsAdmin);
      this._userName.set(`${firstName ?? ''} ${lastName ?? ''}`.trim());
      this._email.set(email ?? '');
      this._authority.set(authority ?? '');
      this._userId.set(UserId ?? '');
    } else {
      this.session.remove('token');
      this.reset();
    }
  }

  refreshPermissions(): void {
    this.initializePermissions();
  }

  reset(): void {
    this._tokenExp.set(0);
    this._permission.set(null);
    this._isSuperAdmin.set(false);
    this._userName.set('');
    this._email.set('');
    this._authority.set('');
    this._role.set(null);
    this._modules.set({});
    this._routes.set({});
    this._options.set(null);
    this._isActive.set(false);
    this._userId.set('');
  }

  // ------- session / token helpers -------
  private getDecodedAccessToken(): DecodedToken | null {
    try {
      const token = this.jwtToken;
      return token ? jwtDecode(token) : null;
    } catch (err) {
      console.error('Error decoding access token', err);
      return null;
    }
  }

  get jwtToken(): string | null {
    return this.session.getToken('token');
  }

  hasToken(): boolean {
    return !!this.jwtToken;
  }

  getPermissionFromSession(): Permission | null {
    return this.session.get<Permission>('permission');
  }

  // ------- internal setters / parsing -------
  private setPermission(full: FullPermission): void {
    // Keep the raw permission if you still want it
    this._permission.set(full);

    // Parse for fast lookups
    this._role.set(full.role);
    this._options.set(full.options ?? null);

    const modulesMap: { [k: string]: Module } = {};
    const routesMap: { [k: string]: Route } = {};
    (full.modules ?? []).forEach((m) => {
      modulesMap[m.id] = m;
      routesMap[m.id] = { id: m.id, path: m.route.path, isRead: true };
    });

    this._modules.set(modulesMap);
    this._routes.set(routesMap);
  }

  // ------- API (signal-friendly) -------
  hasRole = (expectedRole: string): boolean =>
    !!this._role() && this._role() === expectedRole;

  hasModule = (moduleId: string): boolean => !!this._modules()[moduleId];

  hasRoute = (path: string): boolean => !!this._routes()[path];

  canAccessRoute = (path: string): boolean => !!this._routes()[path]?.isRead;

  checkUserPermission(expectedRoute: string): boolean {
    const p = this.getPermissionFromSession();
    if (!p) return true;
    return JSON.stringify(p.modules ?? []).includes(expectedRoute);
  }

  checkUserPagePermission(expectedRoutes: string[]): boolean {
    if (!expectedRoutes?.length) return true;
    const p = this.getPermissionFromSession();
    const haystack = JSON.stringify(p?.modules ?? []);
    return expectedRoutes.some((r) => haystack.includes(r));
  }

  setTokenAfterRefresh(token: string, exp: number) {
    this.session.set('token', token);
    this._tokenExp.set(exp); // private signal from the refactor
    // if you also keep parsed permission in storage, refresh it here as needed
  }
}
