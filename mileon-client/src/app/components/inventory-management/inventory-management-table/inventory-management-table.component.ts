import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SessionService } from '../../../services/session.service';
import { FilterOptions } from '../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../types/filters/ticket/ticketFilterOptions';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TicketIcons } from '../../../types/ticket/ticket-icons.model';
import { User } from '../../../types/user';
import { RouterService } from '../../../services/router.service';
import { InventoryManagementTableService } from './inventory-management-table.service';
import { InventoryManagementSearchService } from '../inventory-management-search/inventory-management-search.service';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-inventory-management-table',
  templateUrl: './inventory-management-table.component.html',
  styleUrls: ['./inventory-management-table.component.scss'],
  standalone: true,
  imports: [TableComponent],
})
export class InventoryManagementTableComponent {
  private readonly inventoryManagementTableService = inject(
    InventoryManagementTableService
  );
  private readonly inventoryManagementSearchForm = inject(
    InventoryManagementSearchService
  );
  private readonly routerService = inject(RouterService);
  private readonly sessionService = inject(SessionService);

  @Input() showSort: boolean = false;
  @Input() sortFromClient: boolean = false;
  @Input() filters: FilterOptions = { currentPage: 1 };
  @Input() data: any[] = [];
  @Input() total: number = 0;
  @Input() count: number = 0;
  @Input() showPaginator: boolean = true;
  @Input() loader: boolean = false;

  @Output() onFormChanges = new EventEmitter<TicketFilterOptions>();
  @Output() emitEditDevice = new EventEmitter<any>();

  readonly userForm: FormGroup = this.inventoryManagementSearchForm.searchForm;
  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  private _columns: Column[] = [];

  get columns(): Column[] {
    return this._columns;
  }

  @Input() set tableColumns(tableName: string) {
    if (tableName) {
      this._columns = (this.inventoryManagementTableService.table as any)[
        tableName
      ];
    }
  }

  async onEditDevice(device: any): Promise<void> {
    this.emitEditDevice.emit(device);
  }

  saveUserSession(user: User): void {
    this.sessionService.set('user', user);
  }

  emitServerSort(form: any): void {
    const formGroup = form as FormGroup;
    this.onFormChanges.emit(formGroup.value);
  }
}
