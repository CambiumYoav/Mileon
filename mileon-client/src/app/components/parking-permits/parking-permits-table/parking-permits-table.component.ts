import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { TableComponent } from '../../shared/table/table.component';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { DraftsAndLettersFilterOptions } from '../../../types/filters/drafts-and-letters/draftsAndLettersFilter';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { ParkingPermitsTableService } from './parking-permits-table.service';
import { ParkingPermitsSearchService } from '../parking-permits-search/parking-permits-search.service';
import { ParkingPermitFilterOptions } from '../../../types/filters/parking-permit/parkingPermitFilterOptions';

@Component({
  selector: 'app-parking-permits-table',
  templateUrl: './parking-permits-table.component.html',
  styleUrl: './parking-permits-table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, TableComponent],
})
export class ParkingPermitsTableComponent implements OnInit, OnDestroy {
  readonly data = input<any[]>([]);
  readonly showSort = input<boolean>(false);
  readonly sortFromClient = input<boolean>(false);
  readonly filters = input<FilterOptions>({ currentPage: 1 });
  readonly total = input<number>(0);
  readonly count = input<number>(0);
  readonly showPaginator = input<boolean>(true);
  readonly loader = input<boolean>(false);
  readonly tableColumns = input<string>('');
  readonly selectedParkingPermitData = input<Subject<any> | null>(null);

  private subscription?: Subscription;

  @Output() emitValues = new EventEmitter<any>();
  @Output() onFormChanges = new EventEmitter<ParkingPermitFilterOptions>();
  @Output() emitEditDevice = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();
  @Output() onRowEvent = new EventEmitter<any>();

  private readonly _columns = signal<Column[]>([]);
  private readonly _parkingPermitForm = signal<FormGroup | null>(null);
  private readonly _errorMsg = signal<string>('');
  private readonly _originalData = signal<any[]>([]);
  private readonly _updatedRows = signal<Map<number, any>>(new Map());
  private readonly _selectedData = signal<any>(null);

  readonly columns = computed(() => this._columns());
  readonly parkingPermitForm = computed(() => this._parkingPermitForm()!);
  readonly errorMsg = computed(() => this._errorMsg());
  readonly originalData = computed(() => this._originalData());
  readonly updatedRows = computed(() => this._updatedRows());
  readonly selectedData = computed(() => this._selectedData());

  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private readonly parkingPermitsTableService = inject(
    ParkingPermitsTableService
  );
  private readonly parkingPermitSearchService = inject(
    ParkingPermitsSearchService
  );

  constructor() {
    this._parkingPermitForm.set(this.parkingPermitSearchService.form);

    effect(() => {
      const tableName = this.tableColumns();
      if (tableName) {
        this._columns.set(
          (this.parkingPermitsTableService.table as any)[tableName]
        );
      }
    });
  }

  ngOnInit(): void {
    // Wait until `data` has all values (fieldNameValue included)
    setTimeout(() => {
      this._originalData.set(JSON.parse(JSON.stringify(this.data())));
    });

    const subject = this.selectedParkingPermitData();
    console.log(this.selectedParkingPermitData());
    if (subject) {
      this.subscription = subject.subscribe((data) => {
        if (data) {
          this._selectedData.set(data);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  emitServerSort(form: FormGroup) {
    this.onFormChanges.emit(form.value);
  }

  emitRowData(rowData: any) {
    this.onRowClick.emit(rowData);
  }

  onCheckboxChange(row: any, event: Event) {
    row.isRequired = (event.target as HTMLInputElement).checked;
    const currentUpdatedRows = new Map(this.updatedRows());
    currentUpdatedRows.set(row.id, { ...row });
    this._updatedRows.set(currentUpdatedRows);
    this.emitChanges();
  }

  onInputChange(row: any, event: Event) {
    row.fieldNameValue = (event.target as HTMLInputElement).value;
    const currentUpdatedRows = new Map(this.updatedRows());
    currentUpdatedRows.set(row.id, { ...row });
    this._updatedRows.set(currentUpdatedRows);
    this.emitChanges();
  }

  emitChanges() {
    const updated = Array.from(this.updatedRows().values());
    this.emitValues.emit(updated);
  }

  // radio
  emitOnRowChange(e: any) {
    console.log(e);
    this.onRowEvent.emit(e);
  }
}
