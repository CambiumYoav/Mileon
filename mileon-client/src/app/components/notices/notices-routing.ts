import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const noticesRoutes: Routes = [
  // Notices home - show the main notices component (הפקות)
  {
    path: '',
    loadComponent: () =>
      import('./notices-main/notices-main.component')
        .then(m => m.NoticesMainComponent),
  },

  // Notices main component (ניהול) - this should be the management component
  {
    path: RP.Notices.Main,
    loadComponent: () =>
      import('./notices-manage/notices-manage.component')
        .then(m => m.NoticesManageComponent),
  },

  // Notices manage component - keeping for backward compatibility
  {
    path: RP.Notices.Manage,
    loadComponent: () =>
      import('./notices-manage/notices-manage.component')
        .then(m => m.NoticesManageComponent),
  }
];