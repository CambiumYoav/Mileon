import {
  Component,
  OnChanges,
  OnInit,
  QueryList,
  SimpleChanges,
  ViewChildren,
  input,
  output,
  signal,
  computed,
  inject,
  effect
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Icon } from '../../../../types/icon';  
import { Column, ColumnTypeEnum } from '../../../../types/table';
import { TableService } from '../../../../components/shared/table/table.service';
import { BaseFormComponent } from '../../../../components/shared/base-form/base-form.component';
import { SearchFormService } from '../../../../components/shared/search-bar/search-form.service';
import { ConstPath } from '../../../../constants/const_path';
import { TableErrors } from '../../../../constants/errors';
import {
  NgbdSortableHeader,
  SortEvent,
  SortDirection,
} from '../../../../directives/sortable.directive';
import { SortOrder } from '../../../../types/enum/sort-order.enum';
import { ActionEnum } from '../../../../types/enum/actionsEnum';
import { PaginatorComponent } from "../../../shared/table/paginator/paginator.component";
import { ActiveComponent } from "../../../shared/base/active/active.component";
import { TagComponent } from "../../../shared/base/tag/tag.component";
import { CheckboxComponent } from "../../../shared/base/checkbox/checkbox.component";
import { IconComponent } from "../../../shared/base/icon/icon.component";
import { RedLineErrorComponent } from "../../../shared/errors/red-line-error/red-line-error.component";
import { RenderIdentityPipe } from "../../../../pipes/identity.pipe";

@Component({
  selector: 'app-user-premissions-assigned-table',
  templateUrl: './user-premissions-assigned-table.component.html',
  styleUrls: ['./user-premissions-assigned-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PaginatorComponent,
    ActiveComponent,
    TagComponent,
    CheckboxComponent,
    IconComponent,
    RedLineErrorComponent,
    RenderIdentityPipe,
    NgbdSortableHeader
],
})
export class UserPremissionsAssignedTableComponent
  extends BaseFormComponent
  implements OnInit, OnChanges
{
  tableService = inject(TableService);
  private searchFormService = inject(SearchFormService);

  columns = input.required<Column[]>();
  data = input<any[]>([]);
  total = input<number>(0);
  form = input<FormGroup>();
  count = input<number>(0);
  pageSize = input<number>(10);
  showPaginator = input<boolean>(true);
  icons = input<Icon[]>([]);
  selectedItemData = input<any>(null);
  parentComponentName = input<string>('');

  onRowEvent = output<any>();
  onFormChanges = output<FormGroup>();
  onRowSelect = output<any>();
  onIconClick = output<any>();

  errorMsg = signal<string>('');
  selectedPage = signal<number>(1);
  isIconToggled = signal<boolean>(false);
  tableData = signal<any[]>([]);
  tableTotal = signal<number>(0);

  hasData = computed(() => this.tableService.data().length > 0);
  displayData = computed(() => this.tableService.sortedData());

  ColumnTypeEnum = ColumnTypeEnum;
  Icons = ConstPath;

  @ViewChildren(NgbdSortableHeader) headers!: QueryList<NgbdSortableHeader>;

  constructor() {
    super();
    
    effect(() => {
      const inputData = this.data();
      const inputTotal = this.total();
      
      if (inputData && inputData.length > 0) {
        this.setTableData(inputData, inputTotal);
        this.errorMsg.set('');
      } else if (inputData && inputData.length === 0) {
        this.resetTable();
        this.errorMsg.set(TableErrors.NOT_FOUND);
      }
    });
  }

  ngOnInit(): void {
    this.listenToPageReset();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // This method is now handled by the effect in ngOnInit
  }

  pageChanges(currentPage: number): void {
    const formValue = this.form();
    if (formValue) {
      formValue.get('currentPage')?.setValue(currentPage);
      this.onFormChanges.emit(formValue);
    }
    this.selectedPage.set(currentPage);
  }

  setTableData(data: any[], total: number): void {
    this.tableService.columns = this.columns();
    this.tableService.setData(data);
    this.tableService.setTotal(total);
    this.tableData.set(data);
    this.tableTotal.set(total);
  }

  onSort({ column, direction, sortByServer }: SortEvent): void {
    // Reset sort direction for all headers except the sorted one
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    if (sortByServer && direction) {
      // Server-side sorting - emit form changes
      const formValue = this.form();
      if (formValue) {
        formValue.patchValue({
          order: SortOrder[direction],
          orderByField: column,
        });
        this.onFormChanges.emit(formValue);
      }
      return;
    }

    // Client-side sorting - update table service
    this.tableService.setSortColumn(column);
    this.tableService.setSortDirection(direction);
  }

  onRowClick(item: any, e: MouseEvent): void {
    const event = e.target as HTMLInputElement;
    if (
      event &&
      (event.type === ColumnTypeEnum.Checkbox ||
        event.type === ColumnTypeEnum.Radio)
    ) {
      return;
    }
    this.onRowEvent.emit(item);
  }

  onSelectedRowIdChange(item: any): void {
    const selectedData = this.selectedItemData();
    if (selectedData && selectedData.next) {
      selectedData.next(item);
    }
  }

  resetTable(): void {
    this.tableService.setData([]);
    this.tableService.setTotal(0);
    this.tableData.set([]);
    this.tableTotal.set(0);
  }

  getIconById(id: number): Icon | undefined {
    return this.icons().find((icon) => icon.id === id);
  }

  getIconPath(iconKey: string): string {
    return (this.Icons as any)[iconKey] || '';
  }

  listenToPageReset(): void {
    const currentPage = this.searchFormService.form.get('currentPage');
    if (currentPage) {
      this.onValueChanges(currentPage).subscribe((res) => {
        this.selectedPage.set(res);
      });
    }
  }

  onIconClickEvent(item: any): void {
    const currentToggleState = item.isIconToggled || false;
    item.isIconToggled = !currentToggleState;

    const action = item.isIconToggled ? ActionEnum.Add : ActionEnum.Remove;
    const emitedData: any = {
      user: item,
      action: action,
    };
    // isIconToggled=true -> add user
    // isIconToggled=false -> remove user
    this.onIconClick.emit(emitedData);
  }

  getSortDirection(column: string): SortDirection {
    const currentSortColumn = this.tableService.sortColumn();
    const currentSortDirection = this.tableService.sortDirection();
    
    if (currentSortColumn === column) {
      return currentSortDirection;
    }
    
    return '';
  }
}
