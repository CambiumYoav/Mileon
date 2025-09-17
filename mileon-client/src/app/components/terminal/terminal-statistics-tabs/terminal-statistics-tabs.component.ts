import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { AppService } from '../../../app.service';
import { SessionService } from '../../../services/session.service';
import { ModuleNames } from '../../../types/enum/moduleEnum';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { TerminalMain } from '../../../types/terminal/terminal.model';
import { TabsGroupComponent } from '../../shared/tabs-group/tabs-group.component';

@Component({
  selector: 'app-terminal-statistics-tabs',
  standalone: true,
  imports: [TabsGroupComponent],
  templateUrl: './terminal-statistics-tabs.component.html',
  styleUrls: ['./terminal-statistics-tabs.component.scss'],
})
export class TerminalStatisticsTabsComponent implements OnInit {
  private readonly appService = inject(AppService);
  private readonly sessionService = inject(SessionService);

  readonly tabs = signal<TabAttributes[]>([...TerminalMain.StatisticsTabs]);
  readonly currentActive = signal<string>(TerminalMain.StatisticsTabs[0]?.text || '');
  readonly currentActiveTabID = signal<string | undefined>(TerminalMain.StatisticsTabs[0]?.id);

  readonly currentTab = computed(() => 
    this.tabs().find(tab => tab.text === this.currentActive())
  );

  ngOnInit(): void {
    const storedTabID = this.sessionService.getToken('currentActiveTabID');
    if (storedTabID) {
      const storedTab = this.tabs().find((tab) => tab.id === storedTabID);
      if (storedTab) {
        this.changeTab(storedTab);
      }
    } else {
      const path = window.location.pathname.split('/');
      const currentTab = path[path.length - 1];
      const foundTab = this.tabs().find((tab) => tab.url === currentTab);
      if (foundTab) {
        this.changeTab(foundTab);
      }
    }
  }

  changeTab(tab: TabAttributes): void {
    this.currentActive.set(tab.text);
    this.currentActiveTabID.set(tab.id);
    if (tab.id) {
      this.sessionService.set('currentActiveTabID', tab.id.toString());
    }
  }

  setCurrentActiveModule(lastTabId: string): void {
    const foundTab = this.tabs().find(
      (t) =>
        t.text === ModuleNames[this.appService.currentModuleName as keyof typeof ModuleNames] ||
        t?.id === lastTabId
    );
    
    this.currentActive.set(foundTab?.text || this.tabs()[0]?.text || '');
    this.currentActiveTabID.set(lastTabId);
  }
}
