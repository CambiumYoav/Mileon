import { NgModule } from '@angular/core';
import { ROUTE_PATH as RP } from '../../constants/routerPath';
import { RouterModule, Routes } from '@angular/router';

export const InventoryManagementRoutes: Routes = [
  {
    path: '',
    redirectTo: RP.InventoryManagement.Main,
    pathMatch: 'full',
  },

  {
    path: RP.InventoryManagement.Main,
    loadComponent: () =>
      import('./inventory-management-main/inventory-management-main.component')
        .then(m => m.InventoryManagementMainComponent),
  },  
];
