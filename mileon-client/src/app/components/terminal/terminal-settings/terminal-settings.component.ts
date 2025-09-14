import { Component, Signal, CUSTOM_ELEMENTS_SCHEMA, inject, signal } from '@angular/core';
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
    title: Signal<string> = signal<string>(TitlesEnum.TerminalSettingsTitle);
    Icons = ConstPath;

    private routerService = inject(RouterService);

    goBackToPreviousPage() {
      this.routerService.navigateToPageURL('');
    }

}
