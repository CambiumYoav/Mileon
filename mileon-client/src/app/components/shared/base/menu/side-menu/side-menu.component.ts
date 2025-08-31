import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { SideMenu } from '../../../../../types/base/menu.model';
import { RouterService } from '../../../../../services/router.service';
import { ROUTE_PATH } from '../../../../../constants/routerPath';
import { PermissionService } from '../../../../../services/permission.service';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SharedImports } from '../../../../../shared/shared-modules';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [SharedImports],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  private _menu: SideMenu | null = null;

  get menu(): SideMenu | null {
    return this._menu;
  }

  @Input({ required: true })
  set menu(value: SideMenu | null) {
    this._menu = value;
    if (value) this.initRoute(value);
  }

  selected: number = 0;
  hovered: number | null = null;
  subscribe: Subscription;
  constructor(
    private routerService: RouterService,
    private permissionsService: PermissionService,
    private router: Router
  ) {
    this.subscribe = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && this._menu) {
        this.initRoute(this._menu);
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscribe.unsubscribe();
  }

  initRoute(menu: SideMenu) {
    menu.menuItems.forEach((item, index) => {
      if (this.routerService.getCurrentUrl().includes(item.path)) {
        this.selected = index;
      }
      if (
        !this.permissionsService.checkUserPagePermission(
          item.permissionRoutes || []
        )
      ) {
        item.disabled = true;
      }
    });

    // if navigated url doesn't contain a menu item, redirect to first one
    if (
      !menu.menuItems.some((item) =>
        this.routerService.getCurrentUrl().includes(item.path)
      )
    )
      this.routerService.navigateTo(menu.menuItems[this.selected].route);
  }

  public readonly ROUTE_PATH = ROUTE_PATH;
}
