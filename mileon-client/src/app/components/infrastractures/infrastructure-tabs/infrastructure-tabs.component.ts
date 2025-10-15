import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppService } from '../../../app.service';
import { ModuleNames } from '../../../types/enum/moduleEnum';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { InfrastructureMain } from '../../../types/infrastructure/infrastructure.model';
import { TabsGroupComponent } from '../../shared/tabs-group/tabs-group.component';

@Component({
  selector: 'app-infrastructure-tabs',
  standalone: true,
  imports: [
    CommonModule,
    TabsGroupComponent
  ],
  templateUrl: './infrastructure-tabs.component.html',
  styleUrls: ['./infrastructure-tabs.component.scss'],
})
export class InfrastructureTabsComponent {
  private appService = inject(AppService);

  tabs = signal<TabAttributes[]>(InfrastructureMain.Tabs);
  currentActive = signal<string>(this.tabs()[0].text);

  constructor() {
    this.initTabs();
    const path = window.location.pathname.split('/');
    const currentTab = path[path.length - 1];
    InfrastructureMain.Tabs.find((tab) => {
      if (tab.url === currentTab) {
        this.changeTab(tab);
      }
    });
  }

  changeTab(tab: TabAttributes) {
    this.currentActive.set(tab.text);
  }

  async initTabs() {
    this.setCurrentActiveModule();
  }

  private setCurrentActiveModule() {
    const moduleName = this.appService.currentModuleName as keyof typeof ModuleNames;
    this.currentActive.set(
      this.tabs().find(
        (t) => t.text === ModuleNames[moduleName]
      )?.text || this.tabs()[0].text
    );
  }
}
