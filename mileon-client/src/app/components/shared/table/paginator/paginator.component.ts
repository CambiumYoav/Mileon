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

  @Input() pageSize!: number; 

  pages: number[] = [];

  private _totalPages: number = 0;
  private _total: number = 0;

  get totalPages(): number {
    return this._totalPages;
  }

  @Input() set total(value: number | null) {
    if (value !== null && value !== undefined) {
      this._total = value;
      if (this.pageSize) {
        this._totalPages = Math.ceil(value / this.pageSize);
        this.pages = this.getVisiblePages(this._totalPages);
      }
    } else {
      this._total = 0;
      this._totalPages = 0;
      this.pages = [];
    }
  }

  get total(): number {
    return this._total;
  }

  getVisiblePages(totalPages: number): number[] {
    const maxVisiblePages = 6;

    // If total pages is less than or equal to maxVisiblePages, show all
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

  constructor() {}

  ngOnInit(): void {
    if (this._total > 0 && this.pageSize > 0) {
      this._totalPages = Math.ceil(this._total / this.pageSize);
      this.pages = this.getVisiblePages(this._totalPages);
    }
  }

  setSelectedPage(page: number) {
    if (page >= 1 && page <= this._totalPages) {
      this.selectedPage = page;
      this.pages = this.getVisiblePages(this._totalPages);
      this.changePage();
    }
  }

  changePage() {
    this.pageChanger.emit(this.selectedPage);
  }

  getStartItem(): number {
    if (this._total === 0) return 0;
    return (this.selectedPage - 1) * this.pageSize + 1;
  }

  getEndItem(): number {
    if (this._total === 0) return 0;
    const end = this.selectedPage * this.pageSize;
    return Math.min(end, this._total);
  }

  getAllPages(): number[] {
    return Array.from({ length: this._totalPages }, (_, i) => i + 1);
  }

  onPageDropdownChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedPage = parseInt(target.value);
    if (selectedPage && selectedPage !== this.selectedPage) {
      this.setSelectedPage(selectedPage);
    }
  }
}
