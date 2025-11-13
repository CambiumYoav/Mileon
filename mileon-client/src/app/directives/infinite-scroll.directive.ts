// import { switchMap } from 'rxjs/internal/operators/switchMap';
// import {
//   Directive,
//   EventEmitter,
//   HostListener,
//   OnDestroy,
//   Output,
// } from '@angular/core';
// import {
//   filter,
//   fromEvent,
//   ReplaySubject,
//   takeUntil,
//   throttleTime,
// } from 'rxjs';
// import { MatSelect } from '@angular/material/select';
// import { GlobalEventHandlers } from '../types/enum/events.enum';

// @Directive({
//   selector: '[appInfiniteScroll]',
// })
// export class InfiniteScrollDirective implements OnDestroy {
//   @Output() scrolled = new EventEmitter<void>();

//   private readonly BOTTOM_SCROLL_OFFSET = 25;

//   directiveDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

//   constructor(private matSelect: MatSelect) {
//     this.matSelect.openedChange
//       .pipe(
//         filter((isOpened) => !!isOpened),
//         switchMap((isOpened) =>
//           fromEvent(
//             this.matSelect.panel.nativeElement,
//             GlobalEventHandlers.SCROLL
//           ).pipe(throttleTime(50))
//         ), //controles the threshold of scroll event
//         takeUntil(this.directiveDestroyed$)
//       )
//       .subscribe((event: any) => {
//         if (
//           event.target.scrollTop >=
//           event.target.scrollHeight -
//             event.target.offsetHeight -
//             this.BOTTOM_SCROLL_OFFSET
//         ) {
//           this.scrolled.emit();
//         }
//       });
//   }

//   ngOnDestroy(): void {
//     this.directiveDestroyed$.next(true);
//     this.directiveDestroyed$.complete();
//   }

//   @HostListener('scroll')
//   onScroll(): void {
//     const isBottom = this.isScrollAtBottom();
//     if (isBottom) {
//     }
//   }

//   private isScrollAtBottom(): boolean {
//     const scrollPosition = window.pageYOffset;
//     const windowSize = window.innerHeight;
//     const bodyHeight = document.body.offsetHeight;
//     return windowSize + scrollPosition >= bodyHeight;
//   }
// }
import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
} from '@angular/core';
import { MatSelect } from '@angular/material/select';
import { EMPTY, Observable, Subject, fromEvent, timer } from 'rxjs';
import { filter, switchMap, takeUntil, throttleTime } from 'rxjs/operators';

@Directive({
  selector: '[appInfiniteScroll]',
  standalone: true, // אם אתה על קומפוננטות standalone; אם במודול - מחק שורה זו והוסף למודול
})
export class InfiniteScrollDirective implements OnDestroy {
  @Output() scrolled = new EventEmitter<void>();

  private readonly destroy$ = new Subject<void>();
  private readonly detach$ = new Subject<void>();
  private readonly THRESHOLD_PX = 120; // כמה קרוב לתחתית להתחיל טעינה

  constructor(private matSelect: MatSelect, private zone: NgZone) {
    this.matSelect.openedChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((opened) => {
        // בכל פתיחה נבטל מנויים קודמים
        this.detach$.next();

        if (!opened) {
          return;
        }

        // נוודא שהפאנל נוצר (לעיתים לוקח טיק)
        timer(0)
          .pipe(
            takeUntil(this.detach$),
            takeUntil(this.destroy$),
            switchMap(() => {
              const panelEl = this.matSelect.panel?.nativeElement as
                | HTMLElement
                | undefined;
              if (!panelEl) {
                return EMPTY;
              }

              // האזנה ל-scroll מחוץ ל-Angular zone לביצועים
              return new Observable<void>((subscriber) => {
                this.zone.runOutsideAngular(() => {
                  const sub = fromEvent(panelEl, 'scroll')
                    .pipe(throttleTime(150))
                    .subscribe(() => {
                      const nearBottom =
                        panelEl.scrollTop + panelEl.clientHeight >=
                        panelEl.scrollHeight - this.THRESHOLD_PX;

                      if (nearBottom) {
                        this.zone.run(() => subscriber.next());
                      }
                    });

                  return () => sub.unsubscribe();
                });
              }).pipe(takeUntil(this.detach$));
            })
          )
          .subscribe(() => {
            this.scrolled.emit();
          });
      });
  }

  ngOnDestroy(): void {
    this.detach$.next();
    this.destroy$.next();
    this.detach$.complete();
    this.destroy$.complete();
  }
}
