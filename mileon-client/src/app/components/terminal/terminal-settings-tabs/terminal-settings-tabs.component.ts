import { Component, WritableSignal, inject, signal } from '@angular/core';
import { AppService } from '../../../app.service';
import { SessionService } from '../../../services/session.service';
import { ModuleNames } from '../../../types/enum/moduleEnum';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { TerminalMain } from '../../../types/terminal/terminal.model';
import { TerminalService } from '../terminal.service';
import { TabsGroupComponent } from '../../shared/tabs-group/tabs-group.component';

@Component({
  selector: 'app-terminal-settings-tabs',
  standalone: true,
  imports: [TabsGroupComponent],
  templateUrl: './terminal-settings-tabs.component.html',
  styleUrls: ['./terminal-settings-tabs.component.scss'],
})
export class TerminalSettingsTabsComponent {
  tabs: WritableSignal<TabAttributes[]> = signal<TabAttributes[]>([...TerminalMain.SettingsTabs]);
  currentActive: WritableSignal<string> = signal<string>('');
  currentActiveTabID: WritableSignal<string | undefined> = signal<string | undefined>(TerminalMain.SettingsTabs[0].id);

  private appService = inject(AppService);
  private terminalService = inject(TerminalService);
  private sessionService = inject(SessionService);

  ngOnInit(): void {
    this.initTabs();
    const storedTabID = this.sessionService.getToken('currentActiveTabID');
    if (storedTabID) {
      const storedTab = this.tabs().find((tab) => tab.id === storedTabID);
      if (storedTab) {
        this.changeTab(storedTab);
      }
    } else {
      const path = window.location.pathname.split('/');
      const currentTab = path[path.length - 1];
      TerminalMain.SettingsTabs.find((tab) => {
        if (tab.url === currentTab) {
          this.changeTab(tab);
        }
      });
    }
  }
  ngOnDestroy(): void {
    this.sessionService.remove('currentActiveTabID');
  }

  changeTab(tab: TabAttributes) {
    this.currentActive.set(tab.text);
    this.currentActiveTabID.set(tab.id);

    if (tab.id) {
      this.sessionService.set('currentActiveTabID', tab.id.toString());
    }
  }

  async initTabs() {
    this.fetchCategories();
  }

  setCurrentActiveModule(lastTabId: string) {
    const moduleKey = this.appService.currentModuleName;
    const moduleDisplayName = moduleKey
      ? ModuleNames[moduleKey as keyof typeof ModuleNames]
      : undefined;

    const newActiveText =
      this.tabs().find(
        (t) =>
          (moduleDisplayName && t.text === moduleDisplayName) ||
          t?.id === lastTabId
      )?.text || this.tabs()[0].text;
    this.currentActive.set(newActiveText);
    this.currentActiveTabID.set(lastTabId);
  }

  private async fetchCategories(): Promise<void> {
    try {
      const categories = await this.terminalService.getSettingsCategories();

      const updatedTabs = this.tabs().map((tab) => {
        const matchedCategory = categories.find(
          (category: any) => tab.text.trim() === category.categoryName.trim()
        );
        if (matchedCategory) {
          return { ...tab, id: matchedCategory.categoryID } as TabAttributes;
        }
        return tab;
      });
      this.tabs.set(updatedTabs);
      const lastTabId = this.sessionService.getToken('currentActiveTabID');
      if (lastTabId) this.setCurrentActiveModule(lastTabId);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
}
