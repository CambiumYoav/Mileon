import { Component, OnInit, inject, ChangeDetectionStrategy, signal, computed } from '@angular/core';
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
  private readonly _tabs = signal<TabAttributes[]>(ManagementMain.Tabs);
  private readonly _currentActive = signal<string>('');
  private readonly _currentActiveTabID = signal<string>(ManagementMain.Tabs[0].id || '');

  readonly tabs = computed(() => this._tabs());
  readonly currentActive = computed(() => this._currentActive());
  readonly currentActiveTabID = computed(() => this._currentActiveTabID());

  private readonly sessionService = inject(SessionService);

  ngOnInit(): void {
    const storedTabID = this.sessionService.getToken('currentActiveTabID') || this.tabs()[0].id;

    const storedTab = this.tabs().find((tab) => tab.id === storedTabID);
    if (storedTab) {
      this.changeTab(storedTab);
    } else {
      this.changeTab(this.tabs()[0]); // Default to the first tab
    }
  }

  changeTab(tab: TabAttributes): void {
    this._currentActive.set(tab.text);
    this._currentActiveTabID.set(tab.id!);

    if (tab.id) {
      this.sessionService.set('currentActiveTabID', tab.id.toString());
    }
  }

  setActiveTabById(tabId: number): void {
    const tab = this.tabs().find((t) => t.id === tabId.toString());

    if (tab) {
      this.changeTab(tab);
    }
  }
}

