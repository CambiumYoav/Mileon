import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  signal,
  computed,
  effect,
  inject,
  OnChanges,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path'; 
import { InfrastructureTablesTypes } from '../../../types/enum/infrastructureTablesEnum';
import { TitlesEnum } from '../../../types/enum/titlesEnum';
import { FilterOptions } from '../../../types/filters/filterOptions';
import {
  InfrastructureSpecialTableTypes,
  InfrastructureTable,
} from '../../../types/infrastructure/infrastructure-table.model';
import { InfrastructureFilterOptions } from '../../../types/infrastructure/infrastructureFilterOptions';
import { Column } from '../../../types/table';
import { InfrastructureService } from '../infrastructure.service';
import { InfrastructuresUtils } from '../../../utils/infrastructuresUtils';
import { AuthorityService } from '../../../services/authority.service ';
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';

@Component({
  selector: 'app-infrastructures-disabled',
  templateUrl: './infrastructures-disabled.component.html',
  styleUrls: ['./infrastructures-disabled.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InfrastructuresTableComponent
  ]
})
export class InfrastructuresDisabledComponent implements OnChanges {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);
  private authorityService = inject(AuthorityService);

  readonly title: string = TitlesEnum.InfrastructureSpecialTitle;
  readonly Icons = ConstPath;
  readonly types = InfrastructureSpecialTableTypes;

  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  filter = signal<FilterOptions | undefined>(undefined);
  loader = signal<boolean>(false);

  dataLength = computed(() => this.data().length);

  @Input() dateValue: string | Date = '';
  @Input() searchText: string = '';
  @Input() searchData!: InfrastructureFilterOptions;
  @Input() infrastructureForm!: FormGroup;
  @Input() isImported: boolean = false;
  @Output() disabledType = new EventEmitter();
  @Output() totalDisabled = new EventEmitter();

  constructor() {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.SpecialsDisabledTable);
    
    this.disabledType.emit(InfrastructureTablesTypes.Disabled);

    this.authorityService.setSuperAdminMunicipal();
    this.authorityService.setMunicipalsToNationalAdmin();

    this.filter.set({
      searchText: this.searchText,
      currentPage: 1,
    });

    this.loadData(this.infrastructureSearchFormService.form);
  }

  // private dataChangeEffect = effect(() => {
  //   const length = this.dataLength();
  //   if (length >= 0) {
  //     this.totalDisabled.emit(length);
  //   }
  // });

  async ngOnChanges(changes: SimpleChanges) {
    if (
      changes['searchText'] ||
      changes['searchData'] ||
      changes['isImported'] ||
      changes['dateValue']
    ) {
      // Update filter with new search text
      this.filter.update(current => ({
        ...current,
        searchText: this.searchText,
        currentPage: current?.currentPage || 1,
      }));
      
      await this.loadData(this.infrastructureSearchFormService.form);
    }
  }

  async loadData(filter: any) {
    this.loader.set(true);

    const startTime = Date.now();
    try {
      const normalizedFilter = InfrastructuresUtils.normalizeFilter(filter);
      
      const updatedFilter = {
        ...normalizedFilter,
        searchText: this.searchText, // Always take from form
        currentPage: normalizedFilter?.currentPage || 1,
        date: this.dateValue,
      };

      const result =
        await this.infrastructureServer.getVehicleInfrastructureTable(
          updatedFilter,
          InfrastructureTablesTypes.Disabled
        );

      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.count.set(this.dataLength());
    } catch (e) {
      InfrastructuresUtils.handleError(e, 'loadData');
    }
    
    await InfrastructuresUtils.ensureMinimumLoaderTime(startTime);
    this.loader.set(false);
  }
}
