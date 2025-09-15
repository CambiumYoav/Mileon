import { Component, inject, output, signal } from '@angular/core';
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
  readonly tabSelected = output<boolean>();

  readonly tabs = signal<TabAttributes[]>([...TerminalMain.SettingsTabs]);
  readonly currentActive = signal('');
  readonly currentActiveTabID = signal<string | undefined>(undefined);

  private readonly appService = inject(AppService);
  private readonly terminalService = inject(TerminalService);
  private readonly sessionService = inject(SessionService);

  constructor() {
    this.initTabs();
  }

  onDestroy() {
    this.sessionService.remove('currentActiveTabID');
  }

  changeTab(tab: TabAttributes) {
    this.currentActive.set(tab.text);
    this.currentActiveTabID.set(tab.id);

    if (tab.id) {
      this.sessionService.set('currentActiveTabID', tab.id.toString());
      this.tabSelected.emit(true);
    }
  }

  private async initTabs() {
    await this.fetchCategories();
  }

  private setCurrentActiveModule(lastTabId: string) {
    const moduleKey = this.appService.currentModuleName;
    const moduleDisplayName = moduleKey
      ? ModuleNames[moduleKey as keyof typeof ModuleNames]
      : undefined;

    const matchingTab = this.tabs().find(
      (t) =>
        (moduleDisplayName && t.text === moduleDisplayName) ||
        t?.id === lastTabId
    );

    if (matchingTab) {
      this.currentActive.set(matchingTab.text);
      this.currentActiveTabID.set(lastTabId);
      this.tabSelected.emit(true);
    }
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }
}
