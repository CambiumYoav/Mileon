import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  inject,
  effect,
} from '@angular/core';
import { SideMenu } from '../../../../../types/base/menu.model';
import { RouterService } from '../../../../../services/router.service';
import { ROUTE_PATH } from '../../../../../constants/routerPath';
import { PermissionService } from '../../../../../services/permission.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SharedImports } from '../../../../../shared/shared-modules';
import { SvgIconComponent } from '../../../svg-icon/svg-icon.component';
@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  imports: [...SharedImports, SvgIconComponent],
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
  private readonly route = inject(ActivatedRoute);
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
            console.log(event)
            this.initRoute(menu);
          }
        });
      }
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {}

  initRoute(menu: SideMenu) {
    menu.menuItems.forEach((item, index) => {
      if (this.routerService.getCurrentUrl().includes(item.path)) {
        console.log(this.routerService.getCurrentUrl());
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
    // console.log(this.routerService.getCurrentUrl());
    // console.log(menu.menuItems[this._selected()].route)
    // this.routerService.navigateToPageURL(menu.menuItems[this._selected()].route)
    // if (
    //   !menu.menuItems.some((item) =>
    //     this.routerService.getCurrentUrl().includes(item.path)
    //   )
    // )
      // this.routerService.navigateTo(menu.menuItems[this._selected()].route);
  }

  // onItemClick(index: number): void {
  //   console.log(index)
  //   this._selected.set(index);
  // }


  
onItemClick(index: number): void {
  this._selected.set(index);

  const menu = this.menu;
  if (!menu) return;

  const item = menu.menuItems[index];
  if (!item || item.disabled) return;

  const target = item.route;

  if (Array.isArray(target)) {
    // אם בעתיד יהיו תפריטים ששומרים commands מלאים
    this.router.navigate(target);
  } else if (typeof target === 'string') {
    if (target.startsWith('/')) {
      // אם תגדיר route עם path מוחלט
      this.router.navigateByUrl(target);
    } else {
      // כאן הקסם שלנו: ניווט יחסי ל-types-main
      this.router.navigate([target], { relativeTo: this.route });
    }
  }
}

  onItemMouseEnter(index: number): void {
    this._hovered.set(index);
  }

  onItemMouseLeave(): void {
    this._hovered.set(null);
  }
}
