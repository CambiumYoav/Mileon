import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { BaseComponents, SharedImports } from '../../shared/shared-modules';
import { Router } from '@angular/router';
import { ConstPath } from '../../constants/const_path';
import { ROUTE_PATH } from '../../constants/routerPath';
import { AuthService } from '../../services/auth.service';
import { AuthorityService } from '../../services/authority.service ';
import { PermissionService } from '../../services/permission.service';
import { RouterService } from '../../services/router.service';
import { UserService } from '../../services/user.service';
import { ModuleNames } from '../../types/enum/moduleEnum';
import { Municipal } from '../../types/municipal';

@Component({
  selector: 'app-header',
  imports: [SharedImports, BaseComponents],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  @Input() sideNav!: { toggle: () => void };
  @Input() email: string = 'michal@mileon.com';

  private routerService = inject(RouterService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private authority = inject(AuthorityService);
  private permission = inject(PermissionService);
  private eRef = inject(ElementRef);
  private router = inject(Router);

  moduleNames = ModuleNames;

  // UI/derived state
  username = '';
  firstLetter = '';
  userAuthorityId = '';

  // signals → read with ()
  municipalsSig = this.authority.municipals;
  currentMunicipalSig = this.authority.currentMunicipal;

  // local UI state
  municipals: Municipal[] = [];
  currentMunicipal: Municipal | null = null;
  openMunicipals = false;
  openUser = false;
  isLoading = false;
  currentPage = 1;
  pageSize = 5;
  hasMorePages = true;
  totalCount = 0;

  readonly mileonLogo = ConstPath.LOGO_MVIEW2;
  readonly municipalLogo = ConstPath.BEER_SHEVA_LOGO;

  ngOnInit(): void {
    // read from signals/services
    this.username = this.userService.getUserNameFromToken(); // wraps signal read
    this.firstLetter = this.email.charAt(0).toUpperCase();
    // if your PermissionService exposes authority() as a signal:
    this.userAuthorityId = this.permission.authority?.() ?? '';
    // initialize lists
    this.loadMunicipals(this.userAuthorityId);

    // if you also want to reflect live changes from the service:
    // (pull latest into local vars used by the template)
    this.currentMunicipal = this.currentMunicipalSig();
    this.municipals = this.municipalsSig();
  }

  private async loadMunicipals(authorityId: string) {
    this.currentPage = 1;
    this.hasMorePages = true;
    this.isLoading = true;

    const { list, totalCount } = await this.authority.getMunicipals(
      this.currentPage
    );
    this.isLoading = false;
    this.totalCount = totalCount;

    const filtered =
      authorityId === '11111111-1111-1111-1111-111111111111'
        ? list
        : list.filter((m) => m.authorityID === authorityId);

    this.municipals = filtered;
    this.hasMorePages = this.municipals.length < this.totalCount;

    const selected =
      filtered.find((m) => m.authorityID === authorityId) ?? filtered[0];

    if (selected) {
      this.setAuthority(selected);
    }

    this.openMunicipals = false;
  }

  setAuthority(municipal: Municipal) {
    if (
      !this.routerService
        .getCurrentUrl()
        .includes(ROUTE_PATH.UsersPermissions.NationalUsers)
    ) {
      this.authority.saveSelectedAuthority(municipal);
      this.currentMunicipal = municipal; // reflect locally
    }
  }

  goToHomePage() {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    localStorage.removeItem('selectedAuthority');
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      this.closeMenus();
    }
  }

  closeMenus() {
    this.openUser = false;
    this.openMunicipals = false;
  }

  toggleSideNav(event: Event) {
    event.stopPropagation();
    this.sideNav?.toggle?.();
    this.closeMenus();
  }

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.openUser = !this.openUser;
    this.openMunicipals = false;
  }

  toggleMunicipalMenu(event: Event) {
    event.stopPropagation();
    this.openMunicipals = !this.openMunicipals;
    this.openUser = false;
  }

  async onScrollMunicipals(event: Event) {
    const el = event.target as HTMLElement;
    const threshold = 50;
    if (
      this.hasMorePages &&
      !this.isLoading &&
      el.scrollTop + el.clientHeight >= el.scrollHeight - threshold
    ) {
      await this.loadMoreMunicipals();
    }
  }

  private async loadMoreMunicipals() {
    if (!this.hasMorePages || this.isLoading) return;

    this.isLoading = true;
    const { list, totalCount } = await this.authority.getMunicipals(
      this.currentPage + 1
    );
    this.totalCount = totalCount;

    if (!list?.length) {
      this.hasMorePages = false;
    } else {
      this.municipals = [...this.municipals, ...list];
      this.currentPage++;
      this.hasMorePages = this.municipals.length < this.totalCount;
    }
    this.isLoading = false;
  }
}
