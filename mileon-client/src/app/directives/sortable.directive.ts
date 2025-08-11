import { Directive, EventEmitter, Input, Output } from '@angular/core';

export type SortColumn = '';
export type SortDirection = 'asc' | 'desc' | '';
const rotate: { [key: string]: SortDirection } = {
  asc: 'desc',
  desc: 'asc',
  '': 'asc',
};

export interface SortEvent {
  column: string;
  direction: SortDirection;
  sortByServer: boolean;
}

@Directive({
  selector: 'th[sortable]',
  host: {
    '[class.asc]': 'direction === "asc"',
    '[class.desc]': 'direction === "desc"',
    '(click)': 'rotate()',
  },
})
export class NgbdSortableHeader {
  @Input() sortable: string = '';
  @Input() direction: SortDirection = '';
  @Input() canSort: boolean = true;
  @Input() sortByServer: boolean = false;
  @Output() sort = new EventEmitter<SortEvent>();

  rotate() {
    if (!this.canSort) return;
    this.direction = rotate[this.direction];
    this.sort.emit({
      column: this.sortable,
      direction: this.direction,
      sortByServer: this.sortByServer,
    });
  }
}
