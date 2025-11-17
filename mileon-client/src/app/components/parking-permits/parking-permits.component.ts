import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppService } from '../../app.service';
import { ModuleEnumKeys, ModuleEnum } from '../../types/enum/moduleEnum';
import { AuthorityService } from '../../services/authority.service ';

@Component({
  selector: 'app-parking-permits',
  imports: [RouterOutlet],
  templateUrl: './parking-permits.component.html',
  styleUrl: './parking-permits.component.scss',
})
export class ParkingPermitsComponent {
  private appService = inject(AppService);
  private authorityService = inject(AuthorityService);

  constructor() {
    this.appService.currentModuleName =
      'ParkingPermitsModule' as ModuleEnumKeys;
    this.appService.id = ModuleEnum.TicketsNewModule;

    this.authorityService.setMunicipalsToNationalRegional();
  }
}
