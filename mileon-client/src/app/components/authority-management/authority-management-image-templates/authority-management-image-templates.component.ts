import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { RouterService } from '../../../services/router.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-image-templates',
  templateUrl: './authority-management-image-templates.component.html',
  styleUrls: ['./authority-management-image-templates.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ButtonComponent,
  ],
})
export class AuthorityManagementImageTemplatesComponent implements OnInit {
  @Output() updateAuthority = new EventEmitter<boolean>();

  private readonly routerService = inject(RouterService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly modeDetectionService = inject(ModeDetectionService);

  ngOnInit() {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementImageTemplatesComponent'
    );
    console.log('Details component mode:', this.isEditMode);
  }

  get isEditMode(): boolean {
    return this.modeDetectionService.getCurrentMode();
  }

  submitForm() {
    if (this.isEditMode) {
      // this.saveFormValuesInSession();
      // this.sharedDataService.emitData(true);
    }
    // this.formResults = []; // Reset results
    // this.isSubmit = true;
  }

  back() {
    this.routerService.back();
  }

  navigateToNextForm() {
    // Simple navigation using service
    this.modeDetectionService.navigateToNext(RP.Management.Portal);
  }
}
