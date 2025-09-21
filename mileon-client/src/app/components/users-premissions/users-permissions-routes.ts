import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const usersPermissionsRoutes: Routes = [
  // Users permissions home - redirect to users
  {
    path: '',
    redirectTo: RP.UsersPermissions.Users,
    pathMatch: 'full',
  },

//   // Users
  {
    path: RP.UsersPermissions.Users,
    loadComponent: () =>
      import('./users/users/users.component')
        .then(m => m.UsersComponent),
  },

//   // National Users
  {
    path: RP.UsersPermissions.NationalUsers,
    loadComponent: () =>
      import('./users/users/users.component')
        .then(m => m.UsersComponent),
  },

//   // Permissions
//   {
//     path: RP.UsersPermissions.Permissions,
//     loadComponent: () =>
//       import('./permissions/permissions/permissions.component')
//         .then(m => m.PermissionsComponent),
//   },

//   // Permissions Table
//   {
//     path: RP.UsersPermissions.Table,
//     loadComponent: () =>
//       import('./permissions/permissions-table/permissions-table.component')
//         .then(m => m.PermissionsTableComponent),
//   },

//   // Permissions Management with children
//   {
//     path: RP.UsersPermissions.Management,
//     loadComponent: () =>
//       import('./permissions/permissions-management/permissions-management.component')
//         .then(m => m.PermissionsManagementComponent),
//     children: [
//       {
//         path: RP.UsersPermissions.UserRoutes,
//         loadComponent: () =>
//           import('./permissions/premissions-user/premissions-user.component')
//             .then(m => m.PremissionsUserComponent),
//       },
//       {
//         path: RP.UsersPermissions.AdminRoutes,
//         loadComponent: () =>
//           import('./permissions/premissions-admin/premissions-admin.component')
//             .then(m => m.PremissionsAdminComponent),
//       },
//     ],
//   },

  // Create User
  {
    path: RP.UsersPermissions.CreateUser,
    loadComponent: () =>
      import('./users/users-create/users-create.component')
        .then(m => m.UsersCreateComponent),
  },

  // Edit User with ID parameter
  {
    path: `${RP.UsersPermissions.User}/:id`,
    loadComponent: () =>
      import('./users/users-edit/users-edit.component')
        .then(m => m.UsersEditComponent),
  },

//   // Parking Permits Management
//   {
//     path: RP.UsersPermissions.ParkingPermitsManagement,
//     loadComponent: () =>
//       import('./user-permissions-managmenet/users-permissions-management/users-permissions-management.component')
//         .then(m => m.UsersPermissionsManagementComponent),
//   },
];
