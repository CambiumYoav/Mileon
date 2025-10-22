import { 
  Component, 
  EventEmitter, 
  Input, 
  Output,
  OnChanges,
  signal,
  computed,
  ChangeDetectionStrategy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ButtonComponent } from "../../base/button/button.component";

@Component({
  selector: 'app-selected-template-text',
  templateUrl: './selected-template-text.component.html',
  styleUrls: ['./selected-template-text.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent],
})
export class SelectedTemplateTextComponent implements OnChanges {
  @Input() data: any;
  @Input() title = 'גוף מכתב- טקסט חופשי';
  @Input() size: any;
  @Output() clickFunction = new EventEmitter<any>();

  private readonly _data = signal<any>(null);
  private readonly _title = signal<string>('גוף מכתב- טקסט חופשי');
  private readonly _size = signal<any>(null);

  readonly dataSignal = computed(() => this._data());
  readonly titleSignal = computed(() => this._title());
  readonly sizeSignal = computed(() => this._size());

  readonly safeData = computed(() => {
    const data = this.dataSignal();
    return data ? this.sanitizer.bypassSecurityTrustHtml(data) : null;
  });

  private readonly sanitizer = inject(DomSanitizer);

  ngOnChanges() {
    this._data.set(this.data);
    this._title.set(this.title);
    this._size.set(this.size);
  }

  onEditClick() {
    this.clickFunction.emit(true);
  }
}
