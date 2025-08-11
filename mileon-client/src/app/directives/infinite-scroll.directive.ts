import { switchMap } from 'rxjs/internal/operators/switchMap';
import {
  Directive,
  EventEmitter,
  HostListener,
  OnDestroy,
  Output,
} from '@angular/core';
import {
  filter,
  fromEvent,
  ReplaySubject,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { MatSelect } from '@angular/material/select';
import { GlobalEventHandlers } from '../types/enum/events.enum';

@Directive({
  selector: '[appInfiniteScroll]',
})
export class InfiniteScrollDirective implements OnDestroy {
  @Output() scrolled = new EventEmitter<void>();

  private readonly BOTTOM_SCROLL_OFFSET = 25;

  directiveDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(private matSelect: MatSelect) {
    this.matSelect.openedChange
      .pipe(
        filter((isOpened) => !!isOpened),
        switchMap((isOpened) =>
          fromEvent(
            this.matSelect.panel.nativeElement,
            GlobalEventHandlers.SCROLL
          ).pipe(throttleTime(50))
        ), //controles the threshold of scroll event
        takeUntil(this.directiveDestroyed$)
      )
      .subscribe((event: any) => {
        if (
          event.target.scrollTop >=
          event.target.scrollHeight -
            event.target.offsetHeight -
            this.BOTTOM_SCROLL_OFFSET
        ) {
          this.scrolled.emit();
        }
      });
  }

  ngOnDestroy(): void {
    this.directiveDestroyed$.next(true);
    this.directiveDestroyed$.complete();
  }

  @HostListener('scroll')
  onScroll(): void {
    const isBottom = this.isScrollAtBottom();
    if (isBottom) {
    }
  }

  private isScrollAtBottom(): boolean {
    const scrollPosition = window.pageYOffset;
    const windowSize = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;
    return windowSize + scrollPosition >= bodyHeight;
  }
}
