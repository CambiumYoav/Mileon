import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthorityService } from '../../../services/authority.service ';
import { SortOrder } from '../../../types/enum/sort-order.enum';
import { ParkingPermitFilterOptions } from '../../../types/filters/parking-permit/parkingPermitFilterOptions';
import { BaseFormService } from '../../shared/base-form/base-form.service';

@Injectable({
  providedIn: 'root',
})
export class ParkingPermitsSearchService {
  form: FormGroup;
  currentAuthority: string | null = null;
  constructor(
    private baseFormService: BaseFormService,
    private authorityService: AuthorityService
  ) {
    this.form = this.baseFormService.createFormGroup(
      ParkingPermitFilterOptions
    );
    this.currentAuthority = this.authorityService.authorityId();
  }

  clearForm() {
    this.form.reset();
    this.form.get('searchText')?.setValue('');
    this.form.get('currentPage')?.setValue(1);
    this.form.get('order')?.setValue(SortOrder.asc);
    this.form.get('authorityIDs')?.setValue([this.currentAuthority]);
  }
}
