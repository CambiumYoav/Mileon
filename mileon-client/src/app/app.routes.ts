import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tickets',
    loadChildren: () =>
      import('./components/tickets-new/tickets-routes').then(
        (m) => m.ticketsRoutes
      ),
  },
];
