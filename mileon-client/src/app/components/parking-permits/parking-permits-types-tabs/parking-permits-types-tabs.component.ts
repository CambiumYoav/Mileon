import { AppService } from '../../../app.service';
import { SessionService } from '../../../services/session.service';
import { ModuleNames } from '../../../types/enum/moduleEnum';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { ParkingPermitsMain } from '../../../types/parkingPermit/parking-permit-tab.model';
import { TerminalMain } from '../../../types/terminal/terminal.model';
import { TerminalService } from '../../terminal/terminal.service';
import { TabsGroupComponent } from './../../shared/tabs-group/tabs-group.component';
import {
  Component,
  computed,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-parking-permits-types-tabs',
  imports: [TabsGroupComponent],
  template: `<div class="pt-3">
    <app-tabs-group
      [tabs]="tabs"
      (action)="changeTab($event)"
      [currentActive]="currentActive()"
    ></app-tabs-group>
  </div> `,
})
export class ParkingPermitsTypesTabsComponent implements OnInit {
  readonly tabSelected = output<boolean>();
  // Constants
  readonly tabs: TabAttributes[] = ParkingPermitsMain.Tabs;

  readonly currentActive = signal<string>(
    ParkingPermitsMain.Tabs[0]?.text || ''
  );
  readonly currentActiveTabID = signal<string | undefined>(
    ParkingPermitsMain.Tabs[0]?.id
  );
  private sessionService = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  // Constants

  // Computed signal for the active tab object
  activeTab = computed(() =>
    this.tabs.find((tab) => tab.id === this.currentActiveTabID())
  );

  constructor() {
    // Setup cleanup on component destroy
    this.destroyRef.onDestroy(() => {
      // Clear the stored tab when leaving the component
      this.sessionService.remove('currentActiveTabID');
    });
  }

  ngOnInit(): void {
    // Retrieve stored tab ID or fallback to default
    const storedTabID =
      this.sessionService.getToken('currentActiveTabID') || this.tabs[0].id;

    // Find the tab with the stored ID and activate it
    const storedTab = this.tabs.find((tab) => tab.id === storedTabID);
    if (storedTab) {
      this.changeTab(storedTab);
    } else {
      this.changeTab(this.tabs[0]); // Default to the first tab
    }
  }

  changeTab(tab: TabAttributes): void {
    // Update active tab properties using signals
    this.currentActive.set(tab.text);
    this.currentActiveTabID.set(tab.id!);

    // Save active tab ID in session storage
    if (tab.id) {
      this.sessionService.set('currentActiveTabID', tab.id.toString());
    }
  }

  public setActiveTabById(tabId: number): void {
    const tab = this.tabs.find((t) => t.id === tabId.toString());

    if (tab) {
      this.changeTab(tab);
    }
  }
}
