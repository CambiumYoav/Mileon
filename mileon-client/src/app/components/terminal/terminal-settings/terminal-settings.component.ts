import { Component, computed, inject, input, model, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { RouterService } from '../../../services/router.service';
import { TerminalSettingsTabsComponent } from '../terminal-settings-tabs/terminal-settings-tabs.component';

@Component({
  selector: 'app-terminal-settings',
  standalone: true,
  imports: [RouterOutlet, TerminalSettingsTabsComponent],
  templateUrl: './terminal-settings.component.html',
  styleUrls: ['./terminal-settings.component.scss'],
})
export class TerminalSettingsComponent {
    readonly title = signal(TitlesEnum.TerminalSettingsTitle);
    readonly Icons = ConstPath;
    readonly isTabSelected = signal(false);

    private readonly routerService = inject(RouterService);

    goBackToPreviousPage() {
      this.routerService.navigateToPageURL('');
    }

    onTabSelected(selected: boolean) {
      this.isTabSelected.set(selected);
    }
}
