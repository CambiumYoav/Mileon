import {
  Component,
  ViewChild,
  OnInit,
  OnDestroy,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
  effect,
  DestroyRef,
  AfterViewInit,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ConstPath } from '../../../constants/const_path';
import { SessionService } from '../../../services/session.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { AuthorityService } from '../../../services/authority.service ';
import { AuthorityManagementTabsComponent } from '../authority-management-tabs/authority-management-tabs.component';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-main',
  templateUrl: './authority-management-main.component.html',
  styleUrls: ['./authority-management-main.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterOutlet, AuthorityManagementTabsComponent],
})
export class AuthorityManagementMainComponent
  implements OnInit, OnDestroy, AfterViewInit
{
  private readonly _title = signal<string>(TitlesEnum.ManagementTitle);
  private readonly _editTitle = signal<string>(TitlesEnum.EditAuthorityTitle);
  private readonly _createTitle = signal<string>(
    TitlesEnum.CreateAuthorityTitle
  );
  private readonly _authorityForms = signal<any[] | null>([]);
  private readonly _authorityDetails = signal<any[] | null>([]);
  private readonly _authorityPortal = signal<any>(null);
  private readonly _authoritySubDomain = signal<any>(null);
  private readonly _authorityTemplates = signal<any | null>(null);
  private readonly _createdId = signal<string>('');

  readonly title = computed(() => this._title());
  readonly editTitle = computed(() => this._editTitle());
  readonly createTitle = computed(() => this._createTitle());
  readonly authorityForms = computed(() => this._authorityForms());
  readonly authorityDetails = computed(() => this._authorityDetails());
  readonly authorityPortal = computed(() => this._authorityPortal());
  readonly authoritySubDomain = computed(() => this._authoritySubDomain());
  readonly authorityTemplates = computed(() => this._authorityTemplates());
  readonly createdId = computed(() => this._createdId());

  readonly Icons = ConstPath;

  @ViewChild('authorityTabs') tabsComponent!: AuthorityManagementTabsComponent;

  private readonly sessionService = inject(SessionService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly modeDetectionService = inject(ModeDetectionService);
  private readonly authorityService = inject(AuthorityService);
  private readonly routerService = inject(RouterService);

  private readonly sharedData = toSignal(this.sharedDataService.data$, {
    initialValue: null,
  });  
  private viewInitialized = signal(false);
  private destroyRef = inject(DestroyRef);
  constructor() {
    // Initialize effects in constructor (injection context)
    // Use effect to reactively respond to shared data changes
    effect(() => {
      const data = this.sharedData();
      if (data) {
        this.getDataFromSession(); // Fetch authority from session
      }
    });
    //FIXME - not working 
    effect(() => {
      const authorityID = this.authorityService.authorityId();;
      const viewReady = this.viewInitialized();
      
      if (this.isEditMode && authorityID && viewReady) {
        this.sessionService.set('currentActiveTabID', 1);
        setTimeout(() => {
          this.tabsComponent?.setActiveTabById(1);
          const baseRoute = RP.Management.Home;
          this.routerService.navigateToPageURL(`${baseRoute}/edit/authority`);
        });
      }
    });

    // Use effect to reactively respond to authority ID changes
    // This effect will only trigger when in edit mode and authority ID changes
    // effect(() => {
    //   const authorityID = this.authorityService.authorityId();
    //   // Only navigate if we're in edit mode and have an authority ID
    //   if (authorityID && this.isEditMode) {
    //     this.sessionService.set('currentActiveTabID', 1);
    //     console.log('Authority ID changed:', authorityID);
    //     console.log('Is Edit Mode:', this.isEditMode);
    //     console.log('Tab component exists:', !!this.tabsComponent);
    //     setTimeout(() => {
    //       if (this.tabsComponent) {
    //         console.log('Setting active tab to 1');
    //         this.tabsComponent.setActiveTabById(1);
    //       } else {
    //         console.error('Tab component not available!');
    //       }

    //       const baseRoute = RP.Management.Home;
    //       const url = `${baseRoute}/edit/authority`;
    //       console.log('Navigating to:', url);
    //       this.routerService.navigateToPageURL(url);
    //     }, 0);
    //   }
    // });
  }
  // ngAfterViewInit(): void {
  //   // Subscribe to authority ID changes AFTER view is initialized
  //   this.authorityService.authorityId$
  //     .pipe(takeUntilDestroyed(this.destroyRef))
  //     .subscribe((authorityID) => {
  //       if (authorityID && this.isEditMode) {
  //         this.sessionService.set('currentActiveTabID', 1);
  //         console.log('Authority ID changed:', authorityID);
  //         console.log('Is Edit Mode:', this.isEditMode);
  //         console.log('Tab component exists:', !!this.tabsComponent);
  //         setTimeout(() => {
  //           if (this.tabsComponent) {
  //             console.log('Setting active tab to 1');
  //             this.tabsComponent.setActiveTabById(1);
  //           } else {
  //             console.error('Tab component not available!');
  //           }

  //           const baseRoute = RP.Management.Home;
  //           const url = `${baseRoute}/edit/authority`;
  //           console.log('Navigating to:', url);
  //           this.routerService.navigateToPageURL(url);
  //         }, 0);
  //       }
  //     });
  // }
  ngOnInit() {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementMainComponent'
    );
  }
  ngAfterViewInit(): void {
    // Subscribe after view is initialized - matching your old working code
    this.viewInitialized.set(true);
  }
  ngOnDestroy() {
    // console.log('AuthorityManagementMainComponent destroyed');
    this.removeDataFromSession(); // Clear session data on destroy
    this.sharedDataService.setCreatedAuthority(null);
    this.sharedDataService.setAuthorityCreationStatus(false);
    this.sharedDataService.setTemplate([]);
  }

  get isEditMode(): boolean {
    return this.modeDetectionService.getCurrentMode();
  }

  getDataFromSession() {
    this._authorityForms.set(this.sessionService.get('authorityForms'));
    this._authorityDetails.set(this.sessionService.get('authorityData'));
    this._authorityTemplates.set(this.sessionService.get('authorityTemplates'));
    this._authoritySubDomain.set(
      this.sessionService.get('authorityPortalSubDomain')
    );
    this._authorityPortal.set(this.sessionService.get('authorityPortalData'));
  }

  removeDataFromSession() {
    this.sessionService.remove('authorityData');
    this.sessionService.remove('authorityTemplates');
    this.sessionService.remove('authorityPortalSubDomain');
    this.sessionService.remove('authorityPortalData');
  }
}
function takeUntilDestroyed(
  destroyRef: any
): import('rxjs').OperatorFunction<string | null, unknown> {
  throw new Error('Function not implemented.');
}
