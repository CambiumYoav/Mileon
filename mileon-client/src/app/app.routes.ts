import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainComponent } from './components/main/main.component';
import { AuthGuard } from './guards/auth.guard';
import { Roles } from './constants/role.const';
import { ROUTE_PATH } from './constants/routerPath';
import { RoleGuard } from './guards/role.guard';
import { RoleEnum } from './types/enum/moduleEnum';
import { TicketsNewComponent } from './components/tickets-new/tickets-new.component';

export const childRoutes: Routes = [
  {
    path: ROUTE_PATH.TicketsNew.Home, // 'tickets-new'
    loadChildren: () =>
      import('./components/tickets-new/tickets-routes')
        .then(m => m.ticketsRoutes),
  },
];
export const routes: Routes = [
  { path: ``, redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: MainComponent, canActivate: [AuthGuard] },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: RoleEnum.ADMIN,
     
        children: [
          {
            path: '',
            redirectTo: `tickets-new`, // or whatever your default should be
            pathMatch: 'full',
          },
          ...childRoutes,
        ],
        canActivate: [RoleGuard],
        data: { expectedRole: Roles.ADMIN.name },
      },
    ],
  },

  {
    path: '**',
    redirectTo: '/login',
  },
];
