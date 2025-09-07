import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { TabAttributes } from '../../../types/filters/tabsGroup';  
import { TimelineSettings } from '../../../types/timeline-settings/timeline-settings';
import { RouterService } from '../../../services/router.service';
import { ConstPath } from '../../../constants/const_path';
import { RouterOutlet } from '@angular/router';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, SharedImports],
})
export class TimelineComponent implements OnInit {
  private readonly _tabs = signal<TabAttributes[]>(TimelineSettings.Tabs);
  private readonly _currentActive = signal<string>(TimelineSettings.Tabs[0].text);
  private readonly _title = signal<string>('ניהול סרגל אכיפה');

  get tabs(): TabAttributes[] {
    return this._tabs();
  }

  get currentActive(): string {
    return this._currentActive();
  }

  get title(): string {
    return this._title();
  }

  readonly Icons = ConstPath;
  private readonly routerService = inject(RouterService);

  ngOnInit(): void {
    this.initTabs();
    const path = window.location.pathname.split('/');
    const currentTab = path;
    TimelineSettings.Tabs.find((tab) => {
      if (tab.url && currentTab.includes(tab.url)) {
        this.changeTab(tab);
      }
    });
  }
  goBackToHomePage() {
    this.routerService.back();
  }

  changeTab(tab: TabAttributes) {
    this._currentActive.set(tab.text);
  }

  async initTabs() {
    this.setCurrentActiveModule();
  }

  private setCurrentActiveModule() {
    this._currentActive.set(this._tabs()[0].text);
  }
}
