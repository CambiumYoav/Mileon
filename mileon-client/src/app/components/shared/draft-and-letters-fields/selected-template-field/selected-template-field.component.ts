import { 
  Component, 
  EventEmitter, 
  Input, 
  OnInit, 
  Output,
  signal,
  computed,
  ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { ConstPath } from '../../../../constants/const_path';

@Component({
  selector: 'app-selected-template-field',
  templateUrl: './selected-template-field.component.html',
  styleUrls: ['./selected-template-field.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
})
export class SelectedTemplateFieldComponent implements OnInit {
  Icons = ConstPath;
  @Input() isImg: boolean = false;
  @Input() buttonText: string = '';
  @Output() clickFunction = new EventEmitter<any>();

  private readonly _isImg = signal<boolean>(false);
  private readonly _buttonText = signal<string>('');

  readonly isImgSignal = computed(() => this._isImg());
  readonly buttonTextSignal = computed(() => this._buttonText());
  
  readonly selectedIcon = computed(() => {
    return this.isImgSignal() ? this.Icons.IMG : this.Icons.DOCUMENT_TEXT_ICON;
  });

  ngOnInit() {
    this._isImg.set(this.isImg);
    this._buttonText.set(this.buttonText);
  }

  onClick() {}
}
