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
  // Angular 19 signals for reactive state management
  private readonly _menu = signal<SideMenu | null>(null);
  private readonly _selected = signal<number>(0);
  private readonly _hovered = signal<number | null>(null);

  // Getters for template access
  get menu(): SideMenu | null {
    return this._menu();
  }

  get selected(): number {
    return this._selected();
  }

  get hovered(): number | null {
    return this._hovered();
  }

  // Constants
  readonly ROUTE_PATH = ROUTE_PATH;

  // Injected services using Angular 19 inject() function
  private readonly routerService = inject(RouterService);
  private readonly permissionsService = inject(PermissionService);
  private readonly router = inject(Router);

  // Inputs with setters
  @Input({ required: true })
  set menu(value: SideMenu | null) {
    this._menu.set(value);
    if (value) this.initRoute(value);
  }

  constructor() {
    // Use effect to handle router events reactively
    effect(() => {
      const menu = this._menu();
      if (menu) {
        // Listen to router events for navigation changes
        this.router.events.subscribe((event) => {
          if (event instanceof NavigationEnd) {
            this.initRoute(menu);
          }
        });
      }
    });
  }

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }

  ngOnDestroy(): void {
    // No subscription cleanup needed as we're using effects
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

    // if navigated url doesn't contain a menu item, redirect to first one
    if (
      !menu.menuItems.some((item) =>
        this.routerService.getCurrentUrl().includes(item.path)
      )
    )
      this.routerService.navigateTo(menu.menuItems[this._selected()].route);
  }

  // Methods for template event handling
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
