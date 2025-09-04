import { Component, ElementRef, ViewChild } from '@angular/core';
import { ConstPath } from './constants/const_path';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet],
})
export class AppComponent {
  @ViewChild('innerScrollContainer') innerScrollContainer!: ElementRef;
  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
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
