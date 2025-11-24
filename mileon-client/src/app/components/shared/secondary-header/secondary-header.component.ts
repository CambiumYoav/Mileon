import { Component, inject, input } from '@angular/core';
import { ConstPath } from '../../../constants/const_path';
import { RoleEnum } from '../../../types/enum/moduleEnum';
import { RouterService } from '../../../services/router.service';

@Component({
  selector: 'app-secondary-header',
  imports: [],
  templateUrl: './secondary-header.component.html',
  styleUrl: './secondary-header.component.scss',
})
export class SecondaryHeaderComponent {
  private routerService = inject(RouterService);
  readonly Icons = ConstPath;

  secondaryHeaderTitle = input<string>('');
  routeNameToGoBack = input<string>('');
  role: RoleEnum | null = null;
  extraParams = input<any>('');
  goBack() {
    this.routerService.back();
  }
}
