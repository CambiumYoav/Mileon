import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { SharedImports } from '../../../../shared/shared-modules';
import { InputSizeEnum } from '../../../../types/enum/inputSizeEnum';

@Component({
  selector: 'app-checkbox',
  imports: [SharedImports],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
})
export class CheckboxComponent implements OnInit {
  @Input()
  checked: boolean = false;

  @Input()
  public toolTip?: string;

  @Input()
  public cssWrapperClass: string = 'checkbox-primary';

  @Input() checkboxSize: InputSizeEnum = InputSizeEnum.Sm;

  @Input()
  public isRequired: boolean = false;

  @Input()
  public isDisabled: boolean | null = null;

  @Input()
  public formId?: string;

  @Input()
  public customError: string = '';

  @Input()
  public placeholder: string = '';

  @Input()
  public label: string = '';

  @Input()
  public labelInnerHTML: string = '';

  @Input()
  public initialValue: string = '';

  @Input()
  public pattern: string | RegExp = '';

  @Input()
  formControlName!: string;

  @Output() valueChanged: EventEmitter<boolean> = new EventEmitter();
  isInitial: Boolean = true;

  constructor() {}
  InputSizeEnum = InputSizeEnum;
  ngOnInit(): void {}

  get fontSizeClass(): string {
    return `text-${this.checkboxSize}`;
  }

  get sizeClass(): string {
    return `checkbox-size-${this.checkboxSize}`;
  }

  get cssSizeClass(): string {
    return `checkbox-${this.checkboxSize}`;
  }

  onInputChange(event: any) {
    const newValue: boolean = event.target.checked;

    this.valueChanged.emit(newValue);
  }
}
