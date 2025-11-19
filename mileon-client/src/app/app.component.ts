import {
  Component,
  ElementRef,
  ViewChild,
  inject,
  effect,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent {
  @ViewChild('innerScrollContainer') innerScrollContainer!: ElementRef;

  private router = inject(Router);

  // Convert router events to signal
  private navigationEnd = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
  );

  constructor() {
    let navigationCount = 0;

    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     navigationCount++;
    //     console.log(`🔄 Navigation #${navigationCount}:`, event.url);

    //     // Detect infinite loop
    //     if (navigationCount > 10) {
    //       console.error('⚠️ POSSIBLE INFINITE LOOP DETECTED!');
    //       console.error('Last URL:', event.url);
    //     }
    //   }

    //   if (event instanceof NavigationError) {
    //     console.error('❌ Navigation error:', event.error);
    //   }
    // });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        console.log('NAV START:', e.url);
      }
      if (e instanceof NavigationEnd) {
        console.log('NAV END:', e.url);
      }
      if (e instanceof NavigationError) {
        console.error('NAV ERROR:', e.error);
      }
    });
    // Use effect to react to navigation changes
    effect(() => {
      const event = this.navigationEnd();
      if (event) {
        // Reset the main document scroll
        window.scrollTo(0, 0);

        // Reset the inner scroll container (if it exists)
        if (this.innerScrollContainer) {
          this.innerScrollContainer.nativeElement.scrollTop = 0;
        }
      }
    });
  }

  title = 'mileon-client';
}
