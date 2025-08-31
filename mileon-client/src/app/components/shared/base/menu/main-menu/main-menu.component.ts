import { MenuItem } from './../../../../../types/base/menu.model';
import { PermissionService } from './../../../../../services/permission.service';
import { RouterService } from '../../../../../services/router.service'; 
import { Menus } from '../../../../../types/menu/main-menu';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
})
export class MainMenuComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isExpanded = false;
  showSubmenu: boolean = false;
  showSubSubMenu: boolean = false;

  constructor(
    private appService: AppService,
    private routerService: RouterService,
    private permissionService: PermissionService
  ) {}

  @Input()
  menu: Menu | null = null;

  ngOnInit(): void {
    this.setMenu();
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
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
      this.menu = Menus.AdminSideMenu;
    } else {
      this.menu = Menus.SideMenu;
      this.menu.menuItems.forEach((tab) => {
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
    }
  }
}
