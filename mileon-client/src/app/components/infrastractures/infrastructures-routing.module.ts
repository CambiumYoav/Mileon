import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InfrastructuresMainComponent } from './infrastructures-main/infrastructures-main.component';
import { InfrastructuresTypeComponent } from './infrastructures-type/infrastructures-type.component';
import { InfrastructuresColorsComponent } from './infrastructures-colors/infrastructures-colors.component';
import { InfrastructuresManufactureComponent } from './infrastructures-manufacture/infrastructures-manufacture.component';
import { ROUTE_PATH as RP } from '../../constants/routerPath';
import { InfrastructuresSubStagesComponent } from './infrastructures-sub-stages/infrastructures-sub-stages.component';
import { InfrastructuresViolationTypesComponent } from './infrastructures-violation-types/infrastructures-violation-types.component';
import { InfrastructuresTicketsSourceComponent } from './infrastructures-tickets-source/infrastructures-tickets-source.component';
import { InfrastructureStreetsComponent } from './infrastructure-streets/infrastructure-streets.component';
import { InfrastructuresCitizensComponent } from './infrastructures-citizens/infrastructures-citizens.component';
import { InfrastructureAreasComponent } from './infrastructure-areas/infrastructure-areas.component';
import { InfrastructuresChipsComponent } from './infrastructures-chips/infrastructures-chips.component';
import { InfrastructuresTicketsStagesStatusesComponent } from './infrastructures-tickets-stages-and-statuses/infrastructures-tickets-stages-statuses/infrastructures-tickets-stages-statuses.component';
import { InfrastructuresPlaintiffsCausesComponent } from './infrastructures-plaintiffs-causes/infrastructures-plaintiffs-causes.component';
import { InfrastructuresSignsComponent } from './infrastructures-signs/infrastructures-signs.component';
import { InfrastructuresSpecialComponent } from './infrastructures-special/infrastructures-special.component';
import { InfrastructuresBusinessComponent } from './infrastructures-business/infrastructures-business.component';
import { InfrastructuresViolationsComponent } from './infrastructures-violations/infrastructures-violations.component';
import { InfrastructuresTollsComponent } from './infrastructures-tolls/infrastructures-tolls.component';
import { InfrastructuresViolationsProcessTypesComponent } from './infrastructures-violations-processtypes/infrastructures-violations-processtypes.component';

export const InfrastructuresRoutes: Routes = [
  {
    path: '',
    component: InfrastructuresMainComponent,
    children: [
      {
        path: ``,
        redirectTo: `${RP.Infrastructure.VehiclesType}`,
        pathMatch: 'full',
      },
      {
        path: `${RP.Infrastructure.VehiclesType}`,
        component: InfrastructuresTypeComponent,
      },
      {
        path: `${RP.Infrastructure.VehiclesColors}`,
        component: InfrastructuresColorsComponent,
      },
      {
        path: `${RP.Infrastructure.VehiclesManufacture}`,
        component: InfrastructuresManufactureComponent,
      },
    ],
  },
  {
    path: `${RP.Infrastructure.SubStages}`,
    component: InfrastructuresSubStagesComponent,
  },
  {
    path: `${RP.Infrastructure.Violation}`,
    component: InfrastructuresViolationTypesComponent,
  },
  {
    path: `${RP.Infrastructure.ViolationProcess}`,
    component: InfrastructuresViolationsProcessTypesComponent,
  },
   {
    path: `${RP.Infrastructure.ViolationProcess}`,
    component: InfrastructuresViolationTypesComponent,
  },
  {
    path: `${RP.Infrastructure.TicketsSource}`,
    component: InfrastructuresTicketsSourceComponent,
  },
  {
    path: `${RP.Infrastructure.TicketsStagesStatuses}`,
    component: InfrastructuresTicketsStagesStatusesComponent,
  },
  {
    path: `${RP.Infrastructure.Streets}`,
    component: InfrastructureStreetsComponent,
  },
  {
    path: `${RP.Infrastructure.Citizens}`,
    component: InfrastructuresCitizensComponent,
  },
  {
    path: `${RP.Infrastructure.Areas}`,
    component: InfrastructureAreasComponent,
  },
  {
    path: `${RP.Infrastructure.Chips}`,
    component: InfrastructuresChipsComponent,
  },
  {
    path: `${RP.Infrastructure.PlaintiffsCauses}`,
    component: InfrastructuresPlaintiffsCausesComponent,
  },
  {
    path: `${RP.Infrastructure.Signs}`,
    component: InfrastructuresSignsComponent,
  },
  {
    path: `${RP.Infrastructure.Special}`,
    component: InfrastructuresSpecialComponent,
  },
  {
    path: `${RP.Infrastructure.Business}`,
    component: InfrastructuresBusinessComponent,
  },
  {
    path: `${RP.Infrastructure.Violations}`,
    component: InfrastructuresViolationsComponent,
  },
  {
    path: `${RP.Infrastructure.Tolls}`,
    component: InfrastructuresTollsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(InfrastructuresRoutes)],
  exports: [RouterModule],
})
export class InfrastructuresRoutingModule {}
