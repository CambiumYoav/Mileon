import { Component, Input, OnDestroy, OnInit, ChangeDetectionStrategy, signal, inject, effect } from '@angular/core';
import { SideMenu } from '../../../../../types/base/menu.model';
import { RouterService } from '../../../../../services/router.service';
import { ROUTE_PATH } from '../../../../../constants/routerPath';
import { PermissionService } from '../../../../../services/permission.service';
import { NavigationEnd, Router } from '@angular/router';
import { SharedImports } from '../../../../../shared/shared-modules';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideMenuComponent implements OnInit, OnDestroy { 
  private readonly _menu = signal<SideMenu | null>(null);
  private readonly _selected = signal<number>(0);
  private readonly _hovered = signal<number | null>(null);

  get menu(): SideMenu | null {
    return this._menu();
  }

  get selected(): number {
    return this._selected();
  }

  get hovered(): number | null {
    return this._hovered();
  }

  readonly ROUTE_PATH = ROUTE_PATH;

  private readonly routerService = inject(RouterService);
  private readonly permissionsService = inject(PermissionService);
  private readonly router = inject(Router);

  @Input({ required: true })
  set menu(value: SideMenu | null) {
    this._menu.set(value);
    if (value) this.initRoute(value);
  }

  constructor() {
    effect(() => {
      const menu = this._menu();
      if (menu) {
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.initRoute(menu);
          }
        });
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  initRoute(menu: SideMenu) {
    menu.menuItems.forEach((item, index) => {
      if (this.routerService.getCurrentUrl().includes(item.path)) {
        this._selected.set(index);
      }
      if (
        !this.permissionsService.checkUserPagePermission(
          item.permissionRoutes || []
        )
      ) {
        item.disabled = true;
      }
    });

    if (
      !menu.menuItems.some((item) =>
        this.routerService.getCurrentUrl().includes(item.path)
      )
    )
      this.routerService.navigateTo(menu.menuItems[this._selected()].route);
  }

  onItemClick(index: number): void {
    this._selected.set(index);
  }

  onItemMouseEnter(index: number): void {
    this._hovered.set(index);
  }

  onItemMouseLeave(): void {
    this._hovered.set(null);
  }
}
