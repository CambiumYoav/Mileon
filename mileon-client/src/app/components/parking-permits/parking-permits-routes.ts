import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const parkingPermitsRoutes: Routes = [
  //   {
  //     path: RP.ParkingPermits.Blank, // Empty path loads immediately
  //     loadComponent: () =>
  //       import('./parking-permits-main/parking-permits-main.component').then(
  //         (m) => m.ParkingPermitsMainComponent
  //       ),
  //   },
  {
    path: RP.ParkingPermits.Blank, // This is likely ''
    loadComponent: () =>
      import('./parking-permits.component').then(
        (m) => m.ParkingPermitsComponent
      ),
    children: [
      {
        path: RP.ParkingPermits.Blank, // This is likely ''
        loadComponent: () =>
          import('./parking-permits-main/parking-permits-main.component').then(
            (m) => m.ParkingPermitsMainComponent
          ),
      },
    ],
  },
];
