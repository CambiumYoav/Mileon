import { Routes } from '@angular/router';
import { ROUTE_PATH as RP } from '../../constants/routerPath';

export const infrastructuresRoutes: Routes = [
  // Infrastructure home - redirect to main
  {
    path: '',
    redirectTo: RP.Infrastructure.Main,
    pathMatch: 'full',
  },

  // main with child routes for vehicle types
  {
    path: RP.Infrastructure.Main,
    loadComponent: () =>
      import('./infrastructures-main/infrastructures-main.component')
        .then(m => m.InfrastructuresMainComponent),
    children: [
      {
        path: '',
        redirectTo: RP.Infrastructure.VehiclesType,
        pathMatch: 'full',
      },
      {
        path: RP.Infrastructure.VehiclesType,
        loadComponent: () =>
          import('./infrastructures-type/infrastructures-type.component')
            .then(m => m.InfrastructuresTypeComponent),
      },
      {
        path: RP.Infrastructure.VehiclesColors,
        loadComponent: () =>
          import('./infrastructures-colors/infrastructures-colors.component')
            .then(m => m.InfrastructuresColorsComponent),
      },
      {
        path: RP.Infrastructure.VehiclesManufacture,
        loadComponent: () =>
          import('./infrastructures-manufacture/infrastructures-manufacture.component')
            .then(m => m.InfrastructuresManufactureComponent),
      },
    ],
  },

  // Sub stages
  {
    path: RP.Infrastructure.SubStages,
    loadComponent: () =>
      import('./infrastructures-sub-stages/infrastructures-sub-stages.component')
        .then(m => m.InfrastructuresSubStagesComponent),
  },

  // Violation types
  {
    path: RP.Infrastructure.Violation,
    loadComponent: () =>
      import('./infrastructures-violation-types/infrastructures-violation-types.component')
        .then(m => m.InfrastructuresViolationTypesComponent),
  },

  // Violation process types
  {
    path: RP.Infrastructure.ViolationProcess,
    loadComponent: () =>
      import('./infrastructures-violations-processtypes/infrastructures-violations-processtypes.component')
        .then(m => m.InfrastructuresViolationsProcessTypesComponent),
  },

  // Tickets source
  {
    path: RP.Infrastructure.TicketsSource,
    loadComponent: () =>
      import('./infrastructures-tickets-source/infrastructures-tickets-source.component')
        .then(m => m.InfrastructuresTicketsSourceComponent),
  },

  // Tickets stages and statuses
  {
    path: RP.Infrastructure.TicketsStagesStatuses,
    loadComponent: () =>
      import('./infrastructures-tickets-stages-and-statuses/infrastructures-tickets-stages-statuses/infrastructures-tickets-stages-statuses.component')
        .then(m => m.InfrastructuresTicketsStagesStatusesComponent),
  },

  // Streets
  {
    path: RP.Infrastructure.Streets,
    loadComponent: () =>
      import('./infrastructure-streets/infrastructure-streets.component')
        .then(m => m.InfrastructureStreetsComponent),
  },

  // Citizens
  {
    path: RP.Infrastructure.Citizens,
    loadComponent: () =>
      import('./infrastructures-citizens/infrastructures-citizens.component')
        .then(m => m.InfrastructuresCitizensComponent),
  },

  // Areas
  {
    path: RP.Infrastructure.Areas,
    loadComponent: () =>
      import('./infrastructure-areas/infrastructure-areas.component')
        .then(m => m.InfrastructureAreasComponent),
  },

  // Chips
  {
    path: RP.Infrastructure.Chips,
    loadComponent: () =>
      import('./infrastructures-chips/infrastructures-chips.component')
        .then(m => m.InfrastructuresChipsComponent),
  },

  // Plaintiffs causes
  {
    path: RP.Infrastructure.PlaintiffsCauses,
    loadComponent: () =>
      import('./infrastructures-plaintiffs-causes/infrastructures-plaintiffs-causes.component')
        .then(m => m.InfrastructuresPlaintiffsCausesComponent),
  },

  // Signs
  {
    path: RP.Infrastructure.Signs,
    loadComponent: () =>
      import('./infrastructures-signs/infrastructures-signs.component')
        .then(m => m.InfrastructuresSignsComponent),
  },

  // Special
  {
    path: RP.Infrastructure.Special,
    loadComponent: () =>
      import('./infrastructures-special/infrastructures-special.component')
        .then(m => m.InfrastructuresSpecialComponent),
  },

  // Business
  {
    path: RP.Infrastructure.Business,
    loadComponent: () =>
      import('./infrastructures-business/infrastructures-business.component')
        .then(m => m.InfrastructuresBusinessComponent),
  },

  // Violations
  {
    path: RP.Infrastructure.Violations,
    loadComponent: () =>
      import('./infrastructures-violations/infrastructures-violations.component')
        .then(m => m.InfrastructuresViolationsComponent),
  },

  // Tolls
  {
    path: RP.Infrastructure.Tolls,
    loadComponent: () =>
      import('./infrastructures-tolls/infrastructures-tolls.component')
        .then(m => m.InfrastructuresTollsComponent),
  },
];

