import { Component, EventEmitter, Input, OnInit, Output, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { ManagementMain } from '../../../types/management/management.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-authority-management-templates-tabs',
  templateUrl: './authority-management-templates-tabs.component.html',
  styleUrls: ['./authority-management-templates-tabs.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
})
export class AuthorityManagementTemplatesTabsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly currentActiveSignal = signal<string>('');
  private readonly currentActiveTabIDSignal = signal<string>(ManagementMain.TemplatesTabs[0]?.id || '');

  readonly currentActive = computed(() => this.currentActiveSignal());
  readonly currentActiveTabID = computed(() => this.currentActiveTabIDSignal());

  tabs: TabAttributes[] = ManagementMain.TemplatesTabs;
  @Input() CustomWidth: number = 0;
  @Output() action = new EventEmitter<TabAttributes>();

  constructor() {
    const queryParamsSignal = toSignal(this.route.queryParams, { initialValue: {} });
    
    effect(() => {
      const params = queryParamsSignal();
      const tabID = (params as any)['tab'] || this.tabs[0]?.id || '';
      const foundTab = this.tabs.find((tab) => tab.id === tabID);
      if (foundTab) {
        this.setActiveTab(foundTab, false);
      } else {
        this.setActiveTab(this.tabs[0], true);
      }
    });
  }

  changeTab(tab: TabAttributes) {
    this.setActiveTab(tab, true);
  }

  private setActiveTab(tab: TabAttributes, updateUrl: boolean) {
    this.currentActiveSignal.set(tab.text);
    this.currentActiveTabIDSignal.set(tab.id || '');

    if (updateUrl && tab.url) {
      this.router.navigate([tab.url], {
        relativeTo: this.route,
      });
    }
  }

  toggleDisabled(btnStatus: boolean = false) {
    for (const filter of this.tabs) {
      filter.disabled = btnStatus;
    }
  }
}
