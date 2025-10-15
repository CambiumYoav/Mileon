import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { Icon } from '../../../types/icon';
import { Column } from '../../../types/table';
import { TableComponent } from '../../shared/table/table.component';

@Component({
  selector: 'app-infrastructures-table',
  templateUrl: './infrastructures-table.component.html',
  styleUrls: ['./infrastructures-table.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TableComponent],
})
export class InfrastructuresTableComponent {
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() total: number = 0;
  @Input() form!: FormGroup;
  @Input() count?: number;
  @Input() pageSize: number = 100;
  @Input() showPaginator: boolean = true;
  @Input() icons: Icon[] = [];
  @Input() selectedItemData!: Subject<any>;
  @Input() parentComponentName: string = '';
  @Input() loader: boolean = true;

  @Output() onRowEvent = new EventEmitter<any>();
  @Output() onFormChanges = new EventEmitter<FormGroup>();
  @Output() onRowSelect = new EventEmitter<any>();
  @Output() onIconClick = new EventEmitter<any>();
}
