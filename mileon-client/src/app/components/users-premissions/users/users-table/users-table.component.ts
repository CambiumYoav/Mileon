import { SessionService } from './../../../../services/session.service';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RouterService } from '../../../../services/router.service';
import { ROUTE_PATH } from '../../../../constants/routerPath';
import { FilterOptions } from '../../../../types/filters/filterOptions';
import { TicketFilterOptions } from '../../../../types/filters/ticket/ticketFilterOptions';
import { Icon } from '../../../../types/icon';  
import { Column } from '../../../../types/table';
import { TicketIcons } from '../../../../types/ticket/ticket-icons.model';
import { UsersSearchFormService } from '../users-search/users-search-form.service';
import { UsersTableService } from './users-table.service';
import { User } from '../../../../types/user';
import { TableComponent } from "../../../shared/table/table.component";
import { UsersTable } from '../../../../types/users/users-table.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss'],
  imports: [TableComponent],
})
export class UsersTableComponent implements OnInit {
  private readonly usersTableService = inject(UsersTableService);
  private readonly userSearchForm = inject(UsersSearchFormService);
  private readonly routerService = inject(RouterService);
  private readonly sessionService = inject(SessionService);

  @Input() showSort: boolean = false;
  @Input() sortFromClient: boolean = false;
  @Input() filters: FilterOptions = {
    currentPage: 1,
  };
  @Input() data: any[] = [];
  @Input() total: number = 0;
  @Input() count: number = 0;
  @Input() isChecked: boolean = false;
  @Input() loader: boolean = true;
  @Input() showPaginator: boolean = true;

  @Output() onFormChanges = new EventEmitter<TicketFilterOptions>();

  private readonly _columns = signal<Column[]>([]);
  
  readonly columns = computed(() => this._columns());

  userForm: FormGroup;
  readonly TicketStagesIcons: Icon[] = TicketIcons.TicketStagesIcons;

  @Input() set tableColumns(tableName: string) {
    if (tableName) {
      this._columns.set(this.usersTableService.table[tableName as keyof UsersTable ]);
    }
  }

  constructor() {
    this.userForm = this.userSearchForm.searchForm;
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['isChecked'] &&
      changes['isChecked'].currentValue !== undefined
    ) {
    }
  }

  updateAllCheckboxes(isChecked: boolean) {
    this.data.forEach((item) => {
      item.isSelected = isChecked;
    });
  }
  async goToEditUser(user: any) {
    this.saveUserSession(user);
    this.routerService.navigateToUrl(
      [
        ROUTE_PATH.UsersPermissions.Home,
        ROUTE_PATH.UsersPermissions.User,
        user.userID,
      ],
      true
    );
  }

  saveUserSession(user: User) {
    this.sessionService.set('user', user);
  }
  emitServerSort(form: FormGroup) {
    this.onFormChanges.emit(form.value);
  }
}
