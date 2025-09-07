import { Component, Input, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { TagColorDirective } from '../../../../directives/tag-color.directive';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TagColorDirective]
})
export class TagComponent implements OnInit {
  // Angular 19 signals for reactive state management
  private readonly _tagId = signal<string>('');
  private readonly _tagName = signal<string>('');
  private readonly _pattern = signal<string | RegExp>('');
  private readonly _fontSize = signal<string | undefined>('16px');
  private readonly _size = signal<'small' | 'large'>('small');

  // Getters for template access
  get tagId(): string {
    return this._tagId();
  }

  get tagName(): string {
    return this._tagName();
  }

  get pattern(): string | RegExp {
    return this._pattern();
  }

  get fontSize(): string | undefined {
    return this._fontSize();
  }

  get size(): 'small' | 'large' {
    return this._size();
  }

  // Computed signal for derived value
  readonly dynamicFontSize = computed(() => {
    return this._size() === 'large' ? '24px' : '16px';
  });

  // Inputs with setters
  @Input() set tagId(value: string) {
    this._tagId.set(value);
  }

  @Input() set tagName(value: string) {
    this._tagName.set(value);
  }

  @Input() set pattern(value: string | RegExp) {
    this._pattern.set(value);
  }

  @Input() set fontSize(value: string | undefined) {
    this._fontSize.set(value);
  }

  @Input() set size(value: 'small' | 'large') {
    this._size.set(value);
  }

  constructor() {}

  ngOnInit(): void {
    // Signals handle reactivity automatically, no manual initialization needed
  }
}
