import { inject, Injectable } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private history: string[] = [];
  private router = inject(Router);
  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
        if (this.history.length > 3) {
          this.history.shift();
        }
      }
    });
  }

  goBack() {
    if (this.history.length > 2) {
      const targetUrl = this.history[this.history.length - 3];
      this.router.navigateByUrl(targetUrl);
    } else {
      this.router.navigateByUrl('/');
    }
  }
}
