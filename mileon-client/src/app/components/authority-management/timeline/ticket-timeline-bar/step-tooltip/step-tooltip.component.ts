import { Component, Input, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-step-tooltip',
  templateUrl: './step-tooltip.component.html',
  styleUrls: ['./step-tooltip.component.scss'],
  imports: [
    SharedImports
],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepTooltipComponent implements OnInit {
  // Angular 19 signals for reactive state management
  private readonly _title = signal<string | undefined>(undefined);
  private readonly _description = signal<string | undefined>(undefined);
  private readonly _last = signal<boolean>(false);
  private readonly _show = signal<boolean>(false);

  // Getters for template access
  get title(): string | undefined {
    return this._title();
  }

  get description(): string | undefined {
    return this._description();
  }

  get last(): boolean {
    return this._last();
  }

  get show(): boolean {
    return this._show();
  }

  // Inputs with setters
  @Input() set title(value: string | undefined) {
    this._title.set(value);
  }

  @Input() set description(value: string | undefined) {
    this._description.set(value);
  }

  @Input() set last(value: boolean) {
    this._last.set(value);
  }

  constructor() {}

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }
}
