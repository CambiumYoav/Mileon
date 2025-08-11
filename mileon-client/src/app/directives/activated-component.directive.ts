// import { managementRoutes } from './../components/management/management-routing.module';
// import { ministryOfInteriorRoutes } from './../components/ministry-of-interior/ministry-of-interior-routing.module';
// import { ministryOfTransportRoutes } from './../components/ministry-of-transport/ministry-of-transport-routing.module';
// import { AppService } from 'src/app/app.service';
// import { Directive } from '@angular/core';
// import { Route, RouterOutlet, Routes } from '@angular/router';
// import { ticketsRoutes } from '../components/tickets-new/tickets-new-routing.module';
// import { legalRequestsRoutes } from '../components/legal-requests/legal-requests-routing.module';
// import { parkingPermitsRoutes } from '../components/parking-permit/parking-permits-routing.module';
// import {
//   ModuleEnumKeys,
//   RoleEnum,
//   RoleEnumKeys,
// } from '../types/enum/moduleEnum';
// import { noticesRoutes } from '../components/notices/notices-routing.module';
// import { InfrastructuresRoutes } from '../components/infrastructures/infrastructures-routing.module';
// import { ProsecutorCaseSettingsRoutes } from '../components/prosecutor-case-settings/prosecutor-case-settings-routing.module';
// import { UserAndPermissionsRoutes } from '../components/users-permissions/users-permissions-routing.module';
// import { InventoryManagementRoutes } from '../components/inventory-management/inventory-management-routing.module';
// import { TerminalRoutes } from '../components/terminal/terminal-routing.module';
// import { authorityManagementRoutes } from '../components/authority-management/authority-management-routing.module';

// @Directive({
//   selector: 'router-outlet',
// })
// export class ActivatedComponentsDirective {
//   ModuleRoutes: { [key in ModuleEnumKeys]: Routes } = {
//     TicketsNewModule: ticketsRoutes,
//     ParkingPermitsModule: parkingPermitsRoutes,
//     LegalRequestsModule: legalRequestsRoutes,
//     MinistryOfInteriorModule: ministryOfInteriorRoutes,
//     MinistryOfTransportModule: ministryOfTransportRoutes,
//     NoticesModule: noticesRoutes,
//     InfrastructureModule: InfrastructuresRoutes,
//     ProsecutorCaseSettingsModule: ProsecutorCaseSettingsRoutes,
//     // ManagementModule: managementRoutes,
//     AuthorityManagementModule:authorityManagementRoutes,
//     UsersPermissionsModule: UserAndPermissionsRoutes,
//     InventoryManagementModule: InventoryManagementRoutes,
//     TerminalModule: TerminalRoutes
//   };

//   constructor(private r: RouterOutlet, private appService: AppService) {
//     r.activateEvents
//       .pipe
//       // takeUntil(r.destroyed),
//       ()
//       .subscribe((compInstance) => {
//         const possibleRole = r.activatedRoute.routeConfig?.path as RoleEnum;
//         for (const key in RoleEnum) {
//           if (RoleEnum[key] === possibleRole) {
//             this.appService.roleEnv = key as RoleEnumKeys;
//           }
//         }
//         this.findCurrentModule(compInstance.constructor.name);
//       });
//   }

//   findCurrentModule(compName: string): void {
//     if (compName === 'DispatcherMainComponent') {
//       this.appService.currentModuleName = 'TicketsNewModule'; // for now, until disptcher main menu will be better
//       return;
//     }
//     for (const key in this.ModuleRoutes) {
//       if (
//         this.ModuleRoutes[key].find(
//           (a: Route) => a?.component?.name === compName
//         )
//       ) {
//         this.appService.currentModuleName = key as ModuleEnumKeys;
//       }
//     }

//     return;
//   }

//   ngOnDestroy() {
//     // destroyed.next;
//     // destroyed.complete();
//   }
// }
