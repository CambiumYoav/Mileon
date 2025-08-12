import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports: [CommonModule],
  standalone: true
})
export class PaginatorComponent implements OnInit {
  @Input() page!: number;

  @Output() pageChanger: EventEmitter<number> = new EventEmitter<number>();

  @Input() selectedPage: number = 1;

  @Input() pageSize: number = 10;

  pages: number[] = [];

  private _totalPages: number = 0;

  // @Input() set total(value: number | null) {
  //   if (value && this.pages.length !== value && this.pageSize) {
  //     this.selectedPage = 1;
  //     const totalPages = Math.ceil(value / this.pageSize);
  //     console.log('totalPages', totalPages);
  //     this.pages = this.counter(totalPages)
  //       .fill(0)
  //       .map((v, i) => ++i);
  //     if (this.pages.length > 30) this.pages = this.pages.slice(0, 40); // NOTE because it overflows, need to define what it's going to do
  //   }
  //   if (!value) this.pages = [];
  // }

  @Input() set total(value: number | null) {
    if (value && this.pageSize) {
      this._totalPages = Math.ceil(value / this.pageSize); // store the full total
      this.pages = this.getVisiblePages(this._totalPages);
    } else {
      this.pages = [];
    }
  }

  getVisiblePages(totalPages: number): number[] {
    const maxVisiblePages = 6;

    // If total pages is less than or equal to 30, show all
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const current = this.selectedPage;
    const half = Math.floor(maxVisiblePages / 2);
    let start = current - half;
    let end = current + half;

    // Adjust start/end boundaries
    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }

    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    // Ensure at least maxVisiblePages are shown
    start = Math.max(start, 1);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  @Input() showPaginator!: boolean;

  private _arrayOfPagesAmount: number[] = [];

  get arrayOfPagesAmount() {
    return this._arrayOfPagesAmount;
  }

  constructor() {}

  ngOnInit(): void {}

  counter(i: number) {
    if (Number.isNaN(i)) return [];
    return new Array(i);
  }

  // setSelectedPage(page: number) {
  //   if (page && page <= this.pages.length) {
  //     this.selectedPage = page;
  //     this.changePage();
  //   }
  // }
  setSelectedPage(page: number) {
    if (page >= 1 && page <= this._totalPages) {
      this.selectedPage = page;
      this.pages = this.getVisiblePages(this._totalPages); // use the real total
      this.changePage();
    }
  }

  changePage() {
    this.pageChanger.emit(this.selectedPage);
  }
}
