import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed, DestroyRef } from '@angular/core';
import { SessionService } from '../../../services/session.service';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { ManagementMain } from '../../../types/management/management.model';
import { TabsGroupComponent } from '../../shared/tabs-group/tabs-group.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-tabs',
  templateUrl: './authority-management-tabs.component.html',
  styleUrls: ['./authority-management-tabs.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TabsGroupComponent,
  ],
})
export class AuthorityManagementTabsComponent implements OnInit {
  private sessionService = inject(SessionService);
  private destroyRef = inject(DestroyRef);

  // Constants
  readonly tabs: TabAttributes[] = ManagementMain.Tabs;

  // Signals for reactive state
  currentActive = signal<string>('');
  currentActiveTabID = signal<string>(ManagementMain.Tabs[0].id || '');

  // Computed signal for the active tab object
  activeTab = computed(() => 
    this.tabs.find(tab => tab.id === this.currentActiveTabID())
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