import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material-module';
import { ButtonComponent } from '../shared/base/button/button.component';
import { HeaderComponent } from '../header/header.component';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from '../../services/base.service';
import { PermissionService } from '../../services/permission.service';
import { RouterService } from '../../services/router.service';
import { Menu, MenuItem } from '../../types/base/menu.model';
import { Menus } from '../../types/menu/main-menu';
import { SubModulesComponent } from './sub-modules/sub-modules.component';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MainMenuComponent } from '../shared/base/menu/main-menu/main-menu.component';
@Component({
  selector: 'app-home-page',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ...MaterialModule,
    ButtonComponent,
    HeaderComponent,
    MainMenuComponent
  ],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
})
export class HomePageComponent {
  menu: Menu | null = null;
  private baseService = inject(BaseService);
  private permissionService = inject(PermissionService);
  private bottomSheet = inject(MatBottomSheet);
  private routerService = inject(RouterService);
  constructor() {
    this.baseService.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `bearer ${sessionStorage['token']}`,
      }),
    };
  }

  ngOnInit(): void {
    this.setMenu();
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

  openBottomSheet(module: MenuItem): void {
    if (module.menuItems && module.menuItems?.length > 0) {
      this.bottomSheet.open(SubModulesComponent, {
        hasBackdrop: true,
        data: { module },
      });
    } else {
      this.routerService.navigateToUrl([module.path], true);
    }
  }
}
