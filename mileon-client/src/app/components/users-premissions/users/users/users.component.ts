import { Component, OnInit, inject} from '@angular/core';
import { RouterService } from '../../../../services/router.service';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { UsersLocalComponent } from './users-local/users-local.component';
import { UsersNationalComponent } from './users-national/users-national.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: true,
  imports: [UsersLocalComponent, UsersNationalComponent],
})
export class UsersComponent implements OnInit {
  private readonly routerService = inject(RouterService);
  isNationalRoute = false;
  ngOnInit(): void {
    this.setupMunicipalMode();
  }

  private setupMunicipalMode(): void {
    this.isNationalRoute = this.routerService
      .getCurrentUrl()
      .includes(ROUTE_PATH.UsersPermissions.NationalUsers);
  }
}
