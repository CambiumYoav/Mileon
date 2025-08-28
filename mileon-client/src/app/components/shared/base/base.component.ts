import { Component, Directive, OnDestroy } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { CORE_IMPORTS, SharedImports } from '../../../shared/shared-modules';

@Directive()
export class BaseComponent implements OnDestroy {
  componentDestroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor() {}

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}
