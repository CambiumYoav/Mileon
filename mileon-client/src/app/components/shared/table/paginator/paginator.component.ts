import { Component, EventEmitter, Input, OnInit, Output, ChangeDetectionStrategy, signal, computed, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss'],
  imports: [CommonModule],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginatorComponent implements OnInit {
  // Angular 19 signals for reactive state management
  private readonly _page = signal<number>(1);
  private readonly _selectedPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _total = signal<number>(0);
  private readonly _showPaginator = signal<boolean>(true);
  private readonly _isDropdownOpen = signal<boolean>(false);

  // Computed signals for derived values
  readonly totalPages = computed(() => {
    const total = this._total();
    const pageSize = this._pageSize();
    return pageSize > 0 ? Math.ceil(total / pageSize) : 0;
  });

  readonly pages = computed(() => {
    const totalPages = this.totalPages();
    return totalPages > 0 ? this.getVisiblePages(totalPages) : [];
  });

  readonly allPages = computed(() => {
    const totalPages = this.totalPages();
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  });

  readonly startItem = computed(() => {
    const total = this._total();
    if (total === 0) return 0;
    return (this._selectedPage() - 1) * this._pageSize() + 1;
  });

  readonly endItem = computed(() => {
    const total = this._total();
    if (total === 0) return 0;
    const end = this._selectedPage() * this._pageSize();
    return Math.min(end, total);
  });

  // Getters for template access
  get page(): number {
    return this._page();
  }

  get selectedPage(): number {
    return this._selectedPage();
  }

  get pageSize(): number {
    return this._pageSize();
  }

  get total(): number {
    return this._total();
  }

  get showPaginator(): boolean {
    return this._showPaginator();
  }

  get isDropdownOpen(): boolean {
    return this._isDropdownOpen();
  }

  // Inputs with setters
  @Input() set page(value: number) {
    this._page.set(value);
  }

  @Input() set selectedPage(value: number) {
    this._selectedPage.set(value);
  }

  @Input() set pageSize(value: number) {
    this._pageSize.set(value);
  }

  @Input() set total(value: number | null) {
    if (value !== null && value !== undefined) {
      this._total.set(value);
    } else {
      this._total.set(0);
    }
  }

  @Input() set showPaginator(value: boolean) {
    this._showPaginator.set(value);
  }

  @Output() pageChanger: EventEmitter<number> = new EventEmitter<number>();

  getVisiblePages(totalPages: number): number[] {
    const maxVisiblePages = 6;

    // If total pages is less than or equal to maxVisiblePages, show all
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const current = this._selectedPage();
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

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }

  setSelectedPage(page: number) {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this._selectedPage.set(page);
      this.changePage();
    }
  }

  changePage() {
    this.pageChanger.emit(this._selectedPage());
  }

  onPageDropdownChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const selectedPage = parseInt(target.value);
    if (selectedPage && selectedPage !== this._selectedPage()) {
      this.setSelectedPage(selectedPage);
    }
  }

  toggleDropdown(): void {
    if (this.totalPages() > 1) {
      this._isDropdownOpen.set(!this._isDropdownOpen());
    }
  }

  closeDropdown(): void {
    this._isDropdownOpen.set(false);
  }

  selectPage(page: number): void {
    this.setSelectedPage(page);
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
