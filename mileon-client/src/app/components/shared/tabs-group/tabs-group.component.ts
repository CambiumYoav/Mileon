import { Component, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { TabAttributes } from '../../../types/filters/tabsGroup';
import { SystemEnum } from '../../../types/enum/systemEnums';

@Component({
  selector: 'app-tabs-group',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tabs-group.component.html',
  styleUrls: ['./tabs-group.component.scss'],
})
export class TabsGroupComponent {
  Icons = ConstPath;
  systemEnum = SystemEnum;

  // Signal-based inputs
  tabs = input.required<TabAttributes[]>();
  errorContent = input<string>('');
  currentActive = input<string>('');

  // Signal-based output
  action = output<TabAttributes>();

  // Computed signal for filtered tabs (non-disabled)
  filteredTabs = computed(() => 
    this.tabs().filter(tab => !tab.disabled)
  );

  toggleDisabled(btnStatus: boolean = false) {
    const currentTabs = this.tabs();
    for (const filter of currentTabs) {
      filter.disabled = btnStatus;
    }
  }

  performAction(actionBtn: TabAttributes) {
    this.action.emit(actionBtn);
  }
}
