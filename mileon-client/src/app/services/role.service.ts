import { inject, Injectable } from '@angular/core';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public permissionService = inject(PermissionService);
  constructor() {}
  private role: string | null = null;

  // Set the current user role
  setRole(role: string) {
    this.role = role;
  }

  // Get the current user role
  getRole(): string | null {
    return this.role;
  }

  // Check if the current role matches the expected role
  hasRole(expectedRole: string): boolean {
    return this.role === expectedRole;
  }
}
