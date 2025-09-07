import { MenuItem } from './../../../../../types/base/menu.model';
import { PermissionService } from './../../../../../services/permission.service';
import { RouterService } from '../../../../../services/router.service'; 
import { Menus } from '../../../../../types/menu/main-menu';
import { Component, Input, OnInit, ViewChild, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Menu } from '../../../../../types/base/menu.model'; 
import { AppService } from '../../../../../app.service'; 
import { Params } from '@angular/router';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainMenuComponent implements OnInit {
  private readonly _isExpanded = signal<boolean>(false);
  private readonly _showSubmenu = signal<boolean>(false);
  private readonly _showSubSubMenu = signal<boolean>(false);
  private readonly _menu = signal<Menu | null>(null);

  get isExpanded(): boolean {
    return this._isExpanded();
  }

  get showSubmenu(): boolean {
    return this._showSubmenu();
  }

  get showSubSubMenu(): boolean {
    return this._showSubSubMenu();
  }

  get menu(): Menu | null {
    return this._menu();
  }

  @ViewChild('sidenav') sidenav!: MatSidenav;

  private readonly appService = inject(AppService);
  private readonly routerService = inject(RouterService);
  private readonly permissionService = inject(PermissionService);

  @Input() set menu(value: Menu | null) {
    this._menu.set(value);
  }

  ngOnInit(): void {
    this.setMenu();
  }

  toggle() {
    this._isExpanded.set(!this._isExpanded());
  }

  async goTo(
    route: string,
    state: Object,
    queryParams?: Params[]
  ): Promise<void> {
    this.routerService.navigateToUrl([route], true, state, queryParams);
    this.toggle();
  }

  setMenu() {
    if (this.permissionService.isAdmin()) {
      this._menu.set(Menus.AdminSideMenu);
    } else {
      const sideMenu = Menus.SideMenu;
      sideMenu.menuItems.forEach((tab) => {
        tab.showItem = true;
        if (tab.permissionRoute) {
          const result = this.permissionService.checkUserPagePermission(
            tab.permissionRoute
          );
          if (!result) {
            tab.active = false;
            tab.showItem = false;
          }
          if (!tab.active) {
            tab.showItem = false;
          }
        }
      });
      this._menu.set(sideMenu);
    }
  }
}
