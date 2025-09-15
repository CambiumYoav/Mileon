import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MaterialModule } from './material-module';
import { SharedModules } from './shared-modules';   
import { RouterOutlet } from '@angular/router';

// Terminal Components
import { TerminalTicketBooksFormComponent } from '../components/terminal/terminal-ticket-books-form/terminal-ticket-books-form.component';
import { TerminalTicketBooksAssignedComponent } from '../components/terminal/terminal-ticket-books-assigned/terminal-ticket-books-assigned.component';
import { TerminalTableComponent } from '../components/terminal/terminal-table/terminal-table.component';
import { TerminalTicketBooksComponent } from '../components/terminal/terminal-ticket-books/terminal-ticket-books.component';
import { TerminalSearchComponent } from '../components/terminal/terminal-search/terminal-search.component';
import { TerminalExportComponent } from '../components/terminal/terminal-export/terminal-export.component';
import { TerminalInspectorsComponent } from '../components/terminal/terminal-inspectors/terminal-inspectors.component';
import { TerminalInspectorDailyComponent } from '../components/terminal/terminal-inspector-daily/terminal-inspector-daily.component';
import { TerminalInsperctorsMessagesComponent } from '../components/terminal/terminal-insperctors-messages/terminal-insperctors-messages.component';
import { TerminalFormComponent } from '../components/terminal/terminal-form/terminal-form.component';
import { TerminalSettingsComponent } from '../components/terminal/terminal-settings/terminal-settings.component';
import { TerminalSettingsTabsComponent } from '../components/terminal/terminal-settings-tabs/terminal-settings-tabs.component';
import { TerminalSettingsGeneralComponent } from '../components/terminal/terminal-settings-general/terminal-settings-general.component';
import { TerminalSettingsColumnComponent } from '../components/terminal/terminal-settings-column/terminal-settings-column.component';
import { TerminalSettingsExternalComponent } from '../components/terminal/terminal-settings-external/terminal-settings-external.component';
import { TerminalSettingsLegalityComponent } from '../components/terminal/terminal-settings-legality/terminal-settings-legality.component';
import { TerminalSettingsIconsComponent } from '../components/terminal/terminal-settings-icons/terminal-settings-icons.component';
import { TerminalStatisticsComponent } from '../components/terminal/terminal-statistics/terminal-statistics.component';
// import { TerminalStatisticsPieComponent } from '../components/terminal/terminal-statistics-pie/terminal-statistics-pie.component';
// import { TerminalStatisticsLineComponent } from '../components/terminal/terminal-statistics-line/terminal-statistics-line.component';
// import { TerminalStatisticsBarComponent } from '../components/terminal/terminal-statistics-bar/terminal-statistics-bar.component';
// import { TerminalStatisticsTabsComponent } from '../components/terminal/terminal-statistics-tabs/terminal-statistics-tabs.component';
// import { TerminalStatisticsTableComponent } from '../components/terminal/terminal-statistics-table/terminal-statistics-table.component';

// Core imports for terminal module
export const TERMINAL_CORE_IMPORTS = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterOutlet,
  NgbModule,
  NgbNavModule,
  DragDropModule,
];

// Shared imports for terminal module
export const TERMINAL_SHARED_IMPORTS = [
  FormsModule,
  ReactiveFormsModule,
  NgbModule,
  DragDropModule,
  NgbNavModule,
  MaterialModule,
  SharedModules,
];

// All terminal components
export const TERMINAL_COMPONENTS = [
  TerminalTicketBooksFormComponent,
  TerminalTicketBooksAssignedComponent,
  TerminalTicketBooksComponent,
  TerminalTableComponent,
  TerminalSearchComponent,
  TerminalExportComponent,
  TerminalInspectorsComponent,
  TerminalInspectorDailyComponent,
  TerminalInsperctorsMessagesComponent,
  TerminalFormComponent,
  TerminalSettingsComponent,
  TerminalSettingsTabsComponent,
  TerminalSettingsGeneralComponent,
  TerminalSettingsColumnComponent,
  TerminalSettingsExternalComponent,
  TerminalSettingsLegalityComponent,
  TerminalSettingsIconsComponent,
  TerminalStatisticsComponent,
  // TerminalStatisticsPieComponent,
  // TerminalStatisticsLineComponent,
  // TerminalStatisticsBarComponent,
  // TerminalStatisticsTabsComponent,
  // TerminalStatisticsTableComponent,
];

// Pipes for terminal module
export const TERMINAL_PIPES = [DatePipe, CurrencyPipe];
