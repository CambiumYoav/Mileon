import {
  Component,
  signal,
  input,
  output,
  effect,
  inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
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
import { SearchFormService } from '../../shared/search-bar/search-form.service';
import { InfrastructuresTableComponent } from '../infrastructures-table/infrastructures-table.component';

@Component({
  selector: 'app-infrastructures-public',
  templateUrl: './infrastructures-public.component.html',
  styleUrls: ['./infrastructures-public.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    InfrastructuresTableComponent
  ]
})
export class InfrastructuresPublicComponent implements OnInit, OnDestroy {
  private infrastructureServer = inject(InfrastructureService);
  private infrastructureSearchFormService = inject(SearchFormService);

  title = signal<string>(TitlesEnum.InfrastructureSpecialTitle);
  Icons = ConstPath;
  columns = signal<Column[]>([]);
  data = signal<any[]>([]);
  total = signal<number>(0);
  count = signal<number>(0);
  filter = signal<FilterOptions>({
    searchText: '',
    currentPage: 1,
  });
  loader = signal<boolean>(false);

  dateValue = input<string | Date>('');
  searchText = input<string>('');
  searchData = input<InfrastructureFilterOptions>();
  infrastructureForm = input<FormGroup>();
  vehicleType = input<InfrastructureTablesTypes>();
  isImported = input<boolean>(false);

  publicType = output<InfrastructureTablesTypes>();
  totalPublic = output<number>();

  types = InfrastructureSpecialTableTypes;
  
  formRef: FormGroup;

  constructor() {
    this.formRef = this.infrastructureSearchFormService.form;
    
    effect(() => {
      const searchText = this.searchText();
      const searchData = this.searchData();
      const isImported = this.isImported();
      const dateValue = this.dateValue();
      
      if (searchText !== undefined || searchData !== undefined || 
          isImported !== undefined || dateValue !== undefined) {
        this.loadData(this.formRef);
      }
    });
  }

  ngOnInit(): void {
    const tableColumns = new InfrastructureTable();
    this.columns.set(tableColumns.SpecialsPublicTable);
    this.publicType.emit(InfrastructureTablesTypes.Public);
    
    this.filter.set({
      searchText: '',
      currentPage: 1,
    });
    this.loadData(this.formRef);
  }

  ngOnDestroy(): void {
    this.infrastructureSearchFormService.clearForm();
  }
  async loadData(filter: any) {
    this.loader.set(true);

    const MIN_LOADER_TIME = 1500;
    const startTime = Date.now();
    try {
      const updatedFilter = {
        ...filter,
        searchText: this.searchText(),
        currentPage: filter.value?.currentPage || 1,
        date: this.dateValue(),
      };

      const result =
        await this.infrastructureServer.getVehicleInfrastructureTable(
          updatedFilter,
          InfrastructureTablesTypes.Public
        );

      this.data.set(result.data);
      this.total.set(result.totalRecords);
      this.totalPublic.emit(result.data.length);
      this.count.set(result.data.length);
    } catch (e) {
      console.error(e);
    }
    const elapsedTime = Date.now() - startTime;
    const remainingTime = MIN_LOADER_TIME - elapsedTime;

    if (remainingTime > 0) {
      await new Promise((resolve) => setTimeout(resolve, remainingTime));
    }
    this.loader.set(false);
  }
}
