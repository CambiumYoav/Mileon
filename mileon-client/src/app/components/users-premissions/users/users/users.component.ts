import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterService } from '../../../../services/router.service';    
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { AuthorityService } from '../../../../services/authority.service ';
import { toSignal } from '@angular/core/rxjs-interop';
import { UsersLocalComponent } from "./users-local/users-local.component";
import { UsersNationalComponent } from "./users-national/users-national.component";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [UsersLocalComponent, UsersNationalComponent],
})
export class UsersComponent implements OnInit {
  private readonly authorityService = inject(AuthorityService);
  private readonly routerService = inject(RouterService);
  
  private readonly currentMunicipal = toSignal(this.authorityService.currentMunicipal$);
  
  readonly isNationalUsersRoute = computed(() => {
    const currentUrl = this.routerService.getCurrentUrl();
    return currentUrl.includes(ROUTE_PATH.UsersPermissions.NationalUsers);
  });
  ngOnInit(): void {
    if (
      this.routerService
        .getCurrentUrl()
        .includes(ROUTE_PATH.UsersPermissions.NationalUsers)
    ) {
      this.authorityService.setSuperAdminMunicipal();
      this.authorityService.setMunicipalsToNationalAdmin();
    } else {
      this.authorityService.setMunicipalsToNationalRegional();
    }
  }
}
