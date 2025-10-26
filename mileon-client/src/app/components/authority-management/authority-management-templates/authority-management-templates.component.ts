import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { ModeDetectionService } from '../../../services/mode-detection.service';
import { SharedDataService } from '../../../services/shared-data.service';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { ToastrService } from 'ngx-toastr';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { AuthorityManagementTemplatesTabsComponent } from '../authority-management-templates-tabs/authority-management-templates-tabs.component';

@Component({
  selector: 'app-authority-management-templates',
  templateUrl: './authority-management-templates.component.html',
  styleUrls: ['./authority-management-templates.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ButtonComponent,
    AuthorityManagementTemplatesTabsComponent,
  ],
})
export class AuthorityManagementTemplatesComponent implements OnInit {
  private readonly routerService = inject(RouterService);
  private readonly sharedDataService = inject(SharedDataService);
  private readonly modeDetectionService = inject(ModeDetectionService);
  private readonly toaster = inject(ToastrService);
  private readonly router = inject(Router);

  @Output() updateAuthority = new EventEmitter<boolean>();
  private readonly validTemplateData = toSignal(
    this.sharedDataService.validTemplateSource$.pipe(
      filter((data) => data?.key === 'isTemplatesValid')
    ),
    { initialValue: { key: 'isTemplatesValid', value: true } }
  );

  readonly isTemplatesValid = computed(() => {
    const data = this.validTemplateData();
    return data?.key === 'isTemplatesValid' ? data.value : true;
  });

  readonly isEditMode = computed(() => this.modeDetectionService.getCurrentMode());

  ngOnInit() {
    this.modeDetectionService.detectAndSetMode(
      'AuthorityManagementTemplatesComponent'
    );
  }

  submitForm() {
    if (this.isEditMode()) {
      // this.saveFormValuesInSession();
      // this.sharedDataService.emitData(true);
    }
    // this.formResults = []; // Reset results
    // this.isSubmit = true;
  }

  back() {
    this.routerService.back();
  }

  readonly templateSteps = [
    `${RP.Management.TextTemplates}/text`,
    `${RP.Management.TextTemplates}/logo`,
    `${RP.Management.Portal}`,
  ];

  // navigateToNextForm() {
  //   // Simple navigation using service
  //   if (!this.isTemplatesValid) {
  //     this.toaster.error(ErrorSuccessMessages.FILL_REQUIRED_TEMPLATE_FIELDS);
  //     return;
  //   }
  //   this.modeDetectionService.navigateToNext(RP.Management.ImagesTemplates);
  // }

  navigateToNextForm(): void {
    if (!this.isTemplatesValid()) {
      this.toaster.error(ErrorSuccessMessages.FILL_REQUIRED_TEMPLATE_FIELDS);
      return;
    }

    const currentUrl = this.router.url;
    const currentStepIndex = this.templateSteps.findIndex((step) =>
      currentUrl.includes(step)
    );

    const nextStep = this.templateSteps[currentStepIndex + 1];

    if (nextStep) {
      this.modeDetectionService.navigateToNext(nextStep);
    } else {
      // Finish flow or redirect elsewhere
      // this.toaster.success('סיימת את כל השלבים');
      // Example: this.router.navigate(['/dashboard']);
    }
  }
}
