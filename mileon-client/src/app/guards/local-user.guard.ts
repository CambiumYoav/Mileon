// local-users.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthorityService } from '../services/authority.service ';


@Injectable({ providedIn: 'root' })
export class LocalUsersGuard implements CanActivate {
  constructor(private authority: AuthorityService) {}
  async canActivate(): Promise<boolean> {
    await this.authority.setMunicipalsToNationalRegional(); // <-- rehydrate full list
    return true;
  }
}
