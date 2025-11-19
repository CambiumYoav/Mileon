import { Component, effect, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { AuthorityService } from '../../../services/authority.service ';
import { RouterService } from '../../../services/router.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { DynamicField } from '../../../types/infrastructure/InfrastructureTypes';
import { ParkingPermitsTypesForm } from '../../../types/parkingPermit/parking-permit-from-fields';
import { BaseFormService } from '../../shared/base-form/base-form.service';
import { ParkingPermitsService } from '../parking-permits.service';
import { PermitsTypesSettingsForm } from '../../../types/parkingPermit/parking-permit-form';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CORE_IMPORTS } from '../../../shared/shared-modules';

@Component({
  selector: 'app-parking-permits-settings',
  imports: [ButtonComponent,CORE_IMPORTS],
  templateUrl: './parking-permits-settings.component.html',
  styleUrl: './parking-permits-settings.component.scss',
})
export class ParkingPermitsSettingsComponent {
  private baseFormService = inject(BaseFormService);
  private routerService = inject(RouterService);
  private parkingPermitsService = inject(ParkingPermitsService);
  private toaster = inject(ToastrService);
  private authorityService = inject(AuthorityService);

  readonly title: string = TitlesEnum.ParkingPermitsTypesTitle;
  readonly Icons = ConstPath;

  permitsSettingsForm: FormGroup;

  fields = signal<DynamicField[]>([]);
  isSubmitted = signal(false);
  currentAuthority = toSignal(this.authorityService.authorityId$, {
    initialValue: null,
  });

  constructor() {
    this.permitsSettingsForm = this.baseFormService.createFormGroup(
      PermitsTypesSettingsForm
    );
    this.baseFormService.setValidations(
      this.permitsSettingsForm,
      PermitsTypesSettingsForm.permitsTypesSettingsValidations
    );
  }

  ngOnInit() {
    const form = new ParkingPermitsTypesForm();
    this.fields.set(form.PermitSettingsFields);
    this.authorityService.setMunicipalsToNationalRegional();

    effect(async () => {
      const authorityID = this.currentAuthority();
      if (authorityID !== null) {
        await this.getNumberOfPermits(authorityID);
      }
    });
  }
  async onSubmit() {
    this.isSubmitted.set(true);
    if (this.permitsSettingsForm.invalid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      return;
    }

    await this.updateNumberOfPermits(
      this.currentAuthority()!,
      this.permitsSettingsForm.get('permitsByIdCount')?.value
    );
  }

  back() {
    this.routerService.back();
  }

  async getNumberOfPermits(authorityId: string) {
    try {
      const res = await this.parkingPermitsService.getNumberOfPermits(
        authorityId
      );

      this.permitsSettingsForm.get('permitsByIdCount')?.setValue(res);
    } catch (error) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(error);
    }
  }

  async updateNumberOfPermits(authorityId: string, value: string) {
    try {
      const res = await this.parkingPermitsService.updateNumberOfPermits(
        authorityId,
        value
      );
      if (res) {
        this.toaster.success(ErrorSuccessMessages.PARKING_PERMIT_COUNT_UPDATED);
      }
    } catch (error) {
      this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      console.log(error);
    }
  }
}
