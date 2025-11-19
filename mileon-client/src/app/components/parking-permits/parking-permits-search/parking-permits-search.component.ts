import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseService } from '../../../services/base.service';
import { SearchByTextEnum } from '../../../types/enum/searchByTextEnum';
import { SearchBarComponent } from '../../shared/search-bar/search-bar.component';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { ParkingPermitsSearchService } from './parking-permits-search.service';
import { PermissionService } from '../../../services/permission.service';
import { AdvancedForm } from '../../../types/advanced-search/form-tab.model';
import { ParkingPermitTabs } from '../../../types/parkingPermit/parking-permit-tabs.model';
import { hoursRange, dateRange } from '../../../validators/hoursRange';
import { ParkingPermitFilterOptions } from '../../../types/filters/parking-permit/parkingPermitFilterOptions';

@Component({
  selector: 'app-parking-permits-search',
  templateUrl: './parking-permits-search.component.html',
  styleUrl: './parking-permits-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, SearchBarComponent],
})
export class ParkingPermitsSearchComponent implements OnInit {
  readonly SearchByTextEnum = SearchByTextEnum;
  readonly resultData = input<any[]>([]);
  readonly total = input<number>(0);
  readonly hasResultsDropdown = input<boolean>(false);
  readonly searchData = input<ParkingPermitFilterOptions | null>(null);
  readonly activeLegalRequestFilter = input<string>('');
  readonly resultCountMessage = input<string>('');
  readonly searchByText = input<SearchByTextEnum>(
    SearchByTextEnum.ParkingPermitsSearch
  );
  readonly authorityId = input<string>('');
  readonly showFilters = input<boolean>(true);
  
  @Output() search = new EventEmitter();
  @Output() onSearch = new EventEmitter<ParkingPermitFilterOptions>();
  @Output() resetTable = new EventEmitter();

  private readonly _parkingPermitsSearchForm = signal<FormGroup | null>(null);
  private readonly _searchText = signal<string>('');
  private readonly _filterHasValue = signal<boolean>(true);
  private readonly _filterAdvanceHasValue = signal<boolean>(false);
  advancedSearch: AdvancedForm = ParkingPermitTabs.ParkingPermitTabs;

  readonly parkingPermitsSearchForm = computed(
    () => this._parkingPermitsSearchForm()!
  );
  readonly searchText = computed(() => this._searchText());
  readonly filterHasValue = computed(() => this._filterHasValue());
  readonly filterAdvanceHasValue = computed(() =>
    this._filterAdvanceHasValue()
  );

  private readonly searchFormService = inject(SearchFormService);
  private readonly parkingPermitsSearchService = inject(
    ParkingPermitsSearchService
  );
  private readonly baseService = inject(BaseService);
  private readonly permissionsService = inject(PermissionService);

  constructor() {
    this._parkingPermitsSearchForm.set(this.parkingPermitsSearchService.form);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Check if authorityId input has changed
    if (changes['authorityId'] && !changes['authorityId'].firstChange) {
      this.patchAuthorityId(changes['authorityId'].currentValue);
    }
  }

  private patchAuthorityId(authorityId: string): void {
    const parkingPermitsOptionsFilterGroup =
      this.parkingPermitsSearchForm().get(
        'parkingPermitsOptionsFilter'
      ) as FormGroup;

    if (parkingPermitsOptionsFilterGroup && authorityId) {
      parkingPermitsOptionsFilterGroup.patchValue({
        authorityIDs: authorityId,
      });
    }
  }
  ngOnDestroy() {
    this.parkingPermitsSearchService.clearForm();
  }
  ngOnInit(): void {
    // Deep clone the advancedSearch to avoid mutating the original
    this.advancedSearch = JSON.parse(JSON.stringify(this.advancedSearch));

    const parkingPermitsOptionsFilterGroup =
      this.parkingPermitsSearchForm()?.get(
        'parkingPermitsOptionsFilter'
      ) as FormGroup;

    if (parkingPermitsOptionsFilterGroup) {
      // Patch the authority value
      if (this.authorityId) {
        this.patchAuthorityId(this.authorityId());
      }

      parkingPermitsOptionsFilterGroup.setValidators(
        Validators.compose([
          hoursRange('fromTime', 'toTime'),
          dateRange('fromExpirationDate', 'toExpirationDate'),
        ])
      );
      parkingPermitsOptionsFilterGroup.updateValueAndValidity();
    }
  }

  async sendFormValue(searchForm: FormGroup) {
    const formValue = searchForm.value;
    for (let key of Object.keys(formValue)) {
      if (formValue[key] && typeof formValue[key] === 'object') {
        for (let k of Object.keys(formValue[key])) {
          if (k.toLowerCase().includes('time') && formValue[key][k]) {
            formValue[key][k] = this.baseService.convertTimeToDateTime(
              formValue[key][k]
            );
          }
        }
      }
      if (key.toLowerCase().includes('date') && formValue[key]) {
        this.baseService.setTimeToMidday(formValue[key]);
      }
    }
    if (searchForm.valid) {
      this.onSearch.emit(searchForm.value);
    }
  }
}
