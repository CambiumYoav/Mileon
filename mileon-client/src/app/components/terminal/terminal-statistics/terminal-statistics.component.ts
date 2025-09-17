import { Component, signal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { TerminalStatisticsTabsComponent } from "../terminal-statistics-tabs/terminal-statistics-tabs.component";

@Component({
  selector: 'app-terminal-statistics',
  standalone: true,
  imports: [TerminalStatisticsTabsComponent, RouterOutlet],
  templateUrl: './terminal-statistics.component.html',
  styleUrls: ['./terminal-statistics.component.scss']
})
export class TerminalStatisticsComponent {
  readonly title = signal(TitlesEnum.StatisticsTitle);
}
