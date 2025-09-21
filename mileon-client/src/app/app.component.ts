import { Component, ElementRef, ViewChild, inject, effect } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
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