import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const terminalRoutes: Routes = [
  // Terminal home - redirect to ticket books
  {
    path: '',
    redirectTo: RP.Terminal.Notebooks,
    pathMatch: 'full',
  },

  // Terminal ticket books
  {
    path: RP.Terminal.Notebooks,
    loadComponent: () =>
      import('./terminal-ticket-books/terminal-ticket-books.component')
        .then(m => m.TerminalTicketBooksComponent),
  },

  // Terminal inspectors
  {
    path: RP.Terminal.Inspectors,
    loadComponent: () =>
      import('./terminal-inspectors/terminal-inspectors.component')
        .then(m => m.TerminalInspectorsComponent),
  },

  // Terminal inspector daily view
  {
    path: `${RP.Terminal.Inspectors}/:inspectorId/:inspectorName`,
    loadComponent: () =>
      import('./terminal-inspector-daily/terminal-inspector-daily.component')
        .then(m => m.TerminalInspectorDailyComponent),
  },

  // Terminal messages
  {
    path: RP.Terminal.Messages,
    loadComponent: () =>
      import('./terminal-insperctors-messages/terminal-insperctors-messages.component')
        .then(m => m.TerminalInsperctorsMessagesComponent),
  },

  // Terminal settings with children
  // {
  //   path: RP.Terminal.Settings,
  //   loadComponent: () =>
  //     import('./terminal-settings/terminal-settings.component')
  //       .then(m => m.TerminalSettingsComponent),
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: RP.Terminal.GeneralSetings,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: RP.Terminal.GeneralSetings,
  //       loadComponent: () =>
  //         import('./terminal-settings-general/terminal-settings-general.component')
  //           .then(m => m.TerminalSettingsGeneralComponent),
  //     },
  //     {
  //       path: RP.Terminal.ExternalInterfaceSettings,
  //       loadComponent: () =>
  //         import('./terminal-settings-external/terminal-settings-external.component')
  //           .then(m => m.TerminalSettingsExternalComponent),
  //     },
  //     {
  //       path: RP.Terminal.LegalityByTypeOfOffenseSettings,
  //       loadComponent: () =>
  //         import('./terminal-settings-legality/terminal-settings-legality.component')
  //           .then(m => m.TerminalSettingsLegalityComponent),
  //     },
  //     {
  //       path: RP.Terminal.IconsSettings,
  //       loadComponent: () =>
  //         import('./terminal-settings-icons/terminal-settings-icons.component')
  //           .then(m => m.TerminalSettingsIconsComponent),
  //     },
  //   ],
  // },

  // Terminal statistics with children
  // {
  //   path: RP.Terminal.Statistics,
  //   loadComponent: () =>
  //     import('./terminal-statistics/terminal-statistics.component')
  //       .then(m => m.TerminalStatisticsComponent),
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: RP.Terminal.StatisticsPie,
  //       pathMatch: 'full',
  //     },
  //     {
  //       path: RP.Terminal.StatisticsPie,
  //       loadComponent: () =>
  //         import('./terminal-statistics-pie/terminal-statistics-pie.component')
  //           .then(m => m.TerminalStatisticsPieComponent),
  //     },
  //     {
  //       path: RP.Terminal.StatisticsLine,
  //       loadComponent: () =>
  //         import('./terminal-statistics-line/terminal-statistics-line.component')
  //           .then(m => m.TerminalStatisticsLineComponent),
  //     },
  //     {
  //       path: RP.Terminal.StatisticsBar,
  //       loadComponent: () =>
  //         import('./terminal-statistics-bar/terminal-statistics-bar.component')
  //           .then(m => m.TerminalStatisticsBarComponent),
  //     },
  //     {
  //       path: RP.Terminal.StatisticsTable,
  //       loadComponent: () =>
  //         import('./terminal-statistics-table/terminal-statistics-table.component')
  //           .then(m => m.TerminalStatisticsTableComponent),
  //     },
  //   ],
  // },
];
