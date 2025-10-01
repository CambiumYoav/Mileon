import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionService } from '../../../../services/session.service';
import { TabAttributes } from '../../../../types/filters/tabsGroup';
import { PermissionsMain } from '../../../../types/permissions/permissions-tabs';
import { TabsGroupComponent } from '../../../../components/shared/tabs-group/tabs-group.component';

@Component({
  selector: 'app-premissions-tabs',
  templateUrl: './premissions-tabs.component.html',
  styleUrls: ['./premissions-tabs.component.scss'],
  standalone: true,
  imports: [CommonModule, TabsGroupComponent]
})
export class PremissionsTabsComponent implements OnInit {
  // Injected services
  private readonly sessionService = inject(SessionService);

  // Signals for reactive state
  tabs = signal<TabAttributes[]>(PermissionsMain.Tabs);
  currentActive = signal<string>('');
  currentActiveTabID = signal<string>('');

  // Computed signals
  hasTabs = computed(() => this.tabs().length > 0);
  activeTab = computed(() => this.tabs().find(tab => tab.id === this.currentActiveTabID()));
  isTabActive = computed(() => (tabId: string) => this.currentActiveTabID() === tabId);

  constructor() {}

  ngOnInit(): void {
    this.initializeActiveTab();
  }

  private initializeActiveTab(): void {
    // Retrieve stored tab ID or fallback to default
    const storedTabID =
      this.sessionService.getToken('currentActivePermissionTabID') ||
      this.tabs()[0]?.id;

    // Find the tab with the stored ID and activate it
    const storedTab = this.tabs().find((tab) => tab.id === storedTabID);
    if (storedTab) {
      this.changeTab(storedTab);
    } else if (this.tabs().length > 0) {
      this.changeTab(this.tabs()[0]); // Default to the first tab
    }
  }

  changeTab(tab: TabAttributes): void {
    // Update active tab properties
    this.currentActive.set(tab.text);
    this.currentActiveTabID.set(tab.id!);

    // Save active tab ID in session storage
    if (tab.id) {
      this.sessionService.set(
        'currentActivePermissionTabID',
        tab.id.toString()
      );
    }
  }

  getTabById(tabId: string): TabAttributes | undefined {
    return this.tabs().find(tab => tab.id === tabId);
  }

  isCurrentTab(tab: TabAttributes): boolean {
    return this.currentActiveTabID() === tab.id;
  }

  resetToDefaultTab(): void {
    if (this.tabs().length > 0) {
      this.changeTab(this.tabs()[0]);
    }
  }
}
