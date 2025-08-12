import { Component, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SharedImports } from '../../../shared/shared-modules';

@Component({
  selector: 'app-base',
  template: ``,
  styles: [``],
  standalone: true,
  imports: [SharedImports],
})
export class BaseComponent implements OnDestroy {
  componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
