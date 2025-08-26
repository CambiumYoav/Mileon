import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfrastructuresComponent } from './infrastructures.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../shared/material-module'; 
import { SharedImports } from '../../shared/shared-modules';
import { InfrastructuresRoutingModule } from './infrastructures-routing.module';
import { AppService } from '../../app.service';
import { ModuleEnum, ModuleEnumKeys } from '../../types/enum/moduleEnum';
// import { InfrastructuresMainComponent } from './infrastructures-main/infrastructures-main.component';
// import { InfrastructureTabsComponent } from './infrastructure-tabs/infrastructure-tabs.component';
// import { InfrastructuresTypeComponent } from './infrastructures-type/infrastructures-type.component';
// import { InfrastructuresTableComponent } from './infrastructures-table/infrastructures-table.component';
// import { InfrastructuresColorsComponent } from './infrastructures-colors/infrastructures-colors.component';
// import { InfrastructuresManufactureComponent } from './infrastructures-manufacture/infrastructures-manufacture.component';
// import { InfrastructuresSearchComponent } from './infrastructures-search/infrastructures-search.component';
import { InfrastructureFormComponent } from './infrastructure-form/infrastructure-form.component';
// import { InfrastructuresSubStagesComponent } from './infrastructures-sub-stages/infrastructures-sub-stages.component';
// import { InfrastructuresViolationTypesComponent } from './infrastructures-violation-types/infrastructures-violation-types.component';
// import { InfrastructureExportComponent } from './infrastructure-export/infrastructure-export.component';
// import { InfrastructuresTicketsSourceComponent } from './infrastructures-tickets-source/infrastructures-tickets-source.component';
// import { InfrastructureStreetsComponent } from './infrastructure-streets/infrastructure-streets.component';
// import { InfrastructuresCitizensComponent } from './infrastructures-citizens/infrastructures-citizens.component';
import { InfrastructureImportComponent } from './infrastructure-import/infrastructure-import.component';
import { TableService } from '../shared/table/table.service';
// import { InfrastructureAreasComponent } from './infrastructure-areas/infrastructure-areas.component';
// import { InfrastructuresChipsComponent } from './infrastructures-chips/infrastructures-chips.component';
import { InfrastructuresFormWrapperComponent } from './infrastructures-form-wrapper/infrastructures-form-wrapper.component';
// import { InfrastructuresTicketsSourceTableComponent } from './infrastructures-tickets-source-table/infrastructures-tickets-source-table.component';
// import { InfrastructuresTicketsStagesStatusesComponent } from './infrastructures-tickets-stages-and-statuses/infrastructures-tickets-stages-statuses/infrastructures-tickets-stages-statuses.component';
// import { InfrastructuresTicketsStagesComponent } from './infrastructures-tickets-stages-and-statuses/infrastructures-tickets-stages/infrastructures-tickets-stages.component';
// import { InfrastructuresTicketsStatusesComponent } from './infrastructures-tickets-stages-and-statuses/infrastructures-tickets-statuses/infrastructures-tickets-statuses.component';
// import { InfrastructuresPlaintiffsCausesComponent } from './infrastructures-plaintiffs-causes/infrastructures-plaintiffs-causes.component';
// import { InfrastructuresSignsComponent } from './infrastructures-signs/infrastructures-signs.component';
// import { InfrastructuresSpecialComponent } from './infrastructures-special/infrastructures-special.component';
// import { InfrastructuresBusinessComponent } from './infrastructures-business/infrastructures-business.component';
// import { InfrastructuresViolationsComponent } from './infrastructures-violations/infrastructures-violations.component';
// import { InfrastructuresTollsComponent } from './infrastructures-tolls/infrastructures-tolls.component';
// import { InfrastructureSpecialImportComponent } from './infrastructure-special-import/infrastructure-special-import.component';
// import { InfrastructuresDisabledComponent } from './infrastructures-disabled/infrastructures-disabled.component';
// import { InfrastructuresPublicComponent } from './infrastructures-public/infrastructures-public.component';
// import { InfrastructuresViolationsProcessTypesComponent } from './infrastructures-violations-processtypes/infrastructures-violations-processtypes.component';

@NgModule({
  providers: [TableService],
  declarations: [
    // InfrastructuresComponent,

    // InfrastructuresMainComponent,

    // InfrastructureTabsComponent,

    // InfrastructuresTypeComponent,

    // InfrastructuresTableComponent,

    // InfrastructuresColorsComponent,

    // InfrastructuresManufactureComponent,

    // InfrastructuresSearchComponent,

    // InfrastructureFormComponent,

    // InfrastructuresSubStagesComponent,

    // InfrastructuresViolationTypesComponent,
    // InfrastructuresViolationsProcessTypesComponent,

    // InfrastructureExportComponent,

    // InfrastructuresTicketsSourceComponent,

    // InfrastructureStreetsComponent,
    // InfrastructureAreasComponent,

    // InfrastructuresTicketsStagesStatusesComponent,
    // InfrastructuresTicketsStagesComponent,
    // InfrastructuresTicketsStatusesComponent,
    // InfrastructuresCitizensComponent,
    // InfrastructureImportComponent,
    // InfrastructuresChipsComponent,
    // InfrastructuresFormWrapperComponent,
    // InfrastructuresTicketsSourceTableComponent,
    // InfrastructuresPlaintiffsCausesComponent,
    // InfrastructuresSignsComponent,
    // InfrastructuresSpecialComponent,
    // InfrastructuresBusinessComponent,
    // InfrastructuresViolationsComponent,
    // InfrastructuresTollsComponent,
    // InfrastructureSpecialImportComponent,
    // InfrastructuresDisabledComponent,
    // InfrastructuresPublicComponent,
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    SharedImports,
    InfrastructuresRoutingModule,
  ],
})
export class InfrastructuresModule {
  constructor(private appService: AppService) {
    this.appService.currentModuleName = <ModuleEnumKeys>(
      InfrastructuresModule.name
    );

    this.appService.id = ModuleEnum[InfrastructuresModule.name as keyof typeof ModuleEnum];
  }
}
