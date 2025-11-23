import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const parkingPermitsRoutes: Routes = [
  {
    path: '', ///main/admin/parking-permits
    loadComponent: () =>
      import('./parking-permits.component').then(
        (m) => m.ParkingPermitsComponent
      ),
    children: [
      //Default /main/admin/parking-permits → ParkingPermitsMainComponent
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () =>
          import('./parking-permits-main/parking-permits-main.component').then(
            (m) => m.ParkingPermitsMainComponent
          ),
      },

      {
        path: RP.ParkingPermits.Main, // 'main'
        redirectTo: '',
        pathMatch: 'full',
      },

      // /main/admin/parking-permits/types-main/...
      {
        path: RP.ParkingPermits.TypesMain, // 'types-main'
        loadComponent: () =>
          import(
            './parking-permits-types-main/parking-permits-types-main.component'
          ).then((m) => m.ParkingPermitsTypesMainComponent),
        children: [
          // Default /types-main → /types-main/types
          {
            path: '',
            pathMatch: 'full',
            redirectTo: RP.ParkingPermits.Types, // 'types'
          },
          {
            path: RP.ParkingPermits.Types, // 'types'
            loadComponent: () =>
              import(
                './parking-permits-types-main-page/parking-permits-types-main-page.component'
              ).then((m) => m.ParkingPermitsTypesMainPageComponent),
          },
          {
            path: RP.ParkingPermits.TypesManagement, // 'permits-types'
            loadComponent: () =>
              import(
                './parking-permits-settings/parking-permits-settings.component'
              ).then((m) => m.ParkingPermitsSettingsComponent),
          },
        ],
      },
      {
        path: RP.ParkingPermits.CreateNew,
        loadComponent: () =>
          import(
            './parking-permit-create/parking-permit-create.component'
          ).then((m) => m.ParkingPermitCreateComponent),
      },
      {
        path: `${RP.ParkingPermits.Create}/${RP.ParkingPermits.CreateUpdateMain}`,
        loadComponent: () =>
          import(
            './parking-permits-types-create-update-main/parking-permits-types-create-update-main.component'
          ).then((m) => m.ParkingPermitsTypesCreateUpdateMainComponent),
        children: [
          {
            path: `${RP.ParkingPermits.PermitsTypesSettings}`,
            loadComponent: () =>
              import(
                './parking-permits-types-create-update/parking-permits-types-create-update.component'
              ).then((m) => m.ParkingPermitsTypesCreateUpdateComponent),
          },
          {
            path: `${RP.ParkingPermits.PermitsTypesDocumnents}`,
            loadComponent: () =>
              import(
                './parking-permits-types-documents/parking-permits-types-documents.component'
              ).then((m) => m.ParkingPermitsTypesDocumentsComponent),
          },
        ],
      },

      {
        path: `${RP.ParkingPermits.Edit}/${RP.ParkingPermits.CreateUpdateMain}/:id/:isActive`,
        loadComponent: () =>
          import(
            './parking-permits-types-create-update-main/parking-permits-types-create-update-main.component'
          ).then((m) => m.ParkingPermitsTypesCreateUpdateMainComponent),
        children: [
          {
            path: `${RP.ParkingPermits.PermitsTypesSettings}`,
            loadComponent: () =>
              import(
                './parking-permits-types-create-update/parking-permits-types-create-update.component'
              ).then((m) => m.ParkingPermitsTypesCreateUpdateComponent),
          },
          {
            path: `${RP.ParkingPermits.PermitsTypesDocumnents}`,
            loadComponent: () =>
              import(
                './parking-permits-types-documents/parking-permits-types-documents.component'
              ).then((m) => m.ParkingPermitsTypesDocumentsComponent),
          },
        ],
      },

      {
        path: `:id`,
        loadComponent: () =>
          import('./parking-permit-item/parking-permit-item.component').then(
            (m) => m.ParkingPermitItemComponent
          ),
        children: [
          {
            path: `${RP.ParkingPermits.Details}`,
            loadComponent: () =>
              import(
                './parking-permit-item/parking-permit-details/parking-permit-details.component'
              ).then((m) => m.ParkingPermitDetailsComponent),
          },
          {
            path: `${RP.ParkingPermits.RequestDocuments}`,
            loadComponent: () =>
              import(
                './parking-permit-item/parking-permit-request-documents/parking-permit-request-documents.component'
              ).then((m) => m.ParkingPermitRequestDocumentsComponent),
          },
        ],
      },
    ],
  },
];
