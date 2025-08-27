import { Component, OnInit } from '@angular/core';
import { TabAttributes } from '../../../types/filters/tabsGroup';  
import { TimelineSettings } from '../../../types/timeline-settings/timeline-settings';
import { RouterService } from '../../../services/router.service';
import { ConstPath } from '../../../constants/const_path';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent implements OnInit {
  tabs: TabAttributes[] = TimelineSettings.Tabs;
  currentActive: string = this.tabs[0].text;
  title: string = 'ניהול סרגל אכיפה';
  Icons = ConstPath;
  constructor(private routerService: RouterService) {}

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
    this.currentActive = tab.text;
  }

  async initTabs() {
    this.setCurrentActiveModule();
  }

  private setCurrentActiveModule() {
    this.currentActive = this.tabs[0].text;
  }
}
