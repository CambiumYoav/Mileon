import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnDestroy,
  Output,
  SimpleChanges,
  inject,
  ChangeDetectionStrategy,
  signal,
  computed,
  input,
  effect,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { AuthorityManagementTableService } from './authority-management-table.service';
import { AuthorityManagementSearchService } from '../authority-management-search/authority-management-search.service';
import { DraftsAndLettersFilterOptions } from '../../../types/filters/drafts-and-letters/draftsAndLettersFilter';
import { TableComponent } from '../../shared/table/table.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-authority-management-table',
  templateUrl: './authority-management-table.component.html',
  styleUrls: ['./authority-management-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TableComponent,
  ],
})
export class AuthorityManagementTableComponent implements OnInit, OnDestroy {
  readonly data = input<any[]>([]);
  readonly showSort = input<boolean>(false);
  readonly sortFromClient = input<boolean>(false);
  readonly filters = input<FilterOptions>({ currentPage: 1 });
  readonly total = input<number>(0);
  readonly count = input<number>(0);
  readonly showPaginator = input<boolean>(true);
  readonly loader = input<boolean>(false);
  readonly tableColumns = input<string>('');
  readonly selectedAuthorityData = input<Subject<any> | null>(null);
  
  private subscription?: Subscription;

  @Output() emitValues = new EventEmitter<any>();
  @Output() onFormChanges = new EventEmitter<DraftsAndLettersFilterOptions>();
  @Output() emitEditDevice = new EventEmitter<any>();
  @Output() onRowClick = new EventEmitter<any>();
  @Output() onRowEvent = new EventEmitter<any>();

  private readonly _columns = signal<Column[]>([]);
  private readonly _userForm = signal<FormGroup | null>(null);
  private readonly _errorMsg = signal<string>('');
  private readonly _originalData = signal<any[]>([]);
  private readonly _updatedRows = signal<Map<number, any>>(new Map());
  private readonly _selectedData = signal<any>(null);

  readonly columns = computed(() => this._columns());
  readonly userForm = computed(() => this._userForm()!);
  readonly errorMsg = computed(() => this._errorMsg());
  readonly originalData = computed(() => this._originalData());
  readonly updatedRows = computed(() => this._updatedRows());
  readonly selectedData = computed(() => this._selectedData());

  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private readonly authorityManagementTableService = inject(AuthorityManagementTableService);
  private readonly authorityManagementSearchService = inject(AuthorityManagementSearchService);

  constructor() {
    this._userForm.set(this.authorityManagementSearchService.searchForm);
    
    effect(() => {
      const tableName = this.tableColumns();
      if (tableName) {
        this._columns.set((this.authorityManagementTableService.table as any)[tableName]);
      }
    });
  }

  ngOnInit(): void {
    // Wait until `data` has all values (fieldNameValue included)
    setTimeout(() => {
      this._originalData.set(JSON.parse(JSON.stringify(this.data())));
    });

    // Subscribe to Subject in ngOnInit (Angular 19 pattern with proper lifecycle)
    const subject = this.selectedAuthorityData();
    if (subject) {
      this.subscription = subject.subscribe((data) => {
        if (data) {
          this._selectedData.set(data);
          // Don't emit onRowClick here to avoid infinite loop
          // The click event is already handled via (onRowClick) binding
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
}
