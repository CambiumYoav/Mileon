// national-users.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorityService } from '../services/authority.service ';


@Injectable({ providedIn: 'root' })
export class NationalUsersGuard implements CanActivate {
  constructor(private authority: AuthorityService) {}
  canActivate(): boolean {
    this.authority.setSuperAdminMunicipal();
    this.authority.setMunicipalsToNationalAdmin();
    return true;
  }
}
