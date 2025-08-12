import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Component({
  selector: 'app-base',
  template: ``,
  styles: [``],
})
export class BaseComponent implements OnDestroy {
  componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
