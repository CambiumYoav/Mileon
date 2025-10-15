import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ConstPath } from '../../../constants/const_path';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { RouterService } from '../../../services/router.service';
import { InfrastructureTabsComponent } from '../infrastructure-tabs/infrastructure-tabs.component';

@Component({
  selector: 'app-infrastructures-main',
  templateUrl: './infrastructures-main.component.html',
  styleUrls: ['./infrastructures-main.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    InfrastructureTabsComponent
  ]
})
export class InfrastructuresMainComponent {
  private routerService = inject(RouterService);
  
  title = signal<string>(TitlesEnum.InfrastructureVehicleTitle);
  Icons = ConstPath;

  goBackToPreviousPage() {
    this.routerService.navigateToPageURL('');
  }

  back() {
    this.routerService.back();
  }
}
