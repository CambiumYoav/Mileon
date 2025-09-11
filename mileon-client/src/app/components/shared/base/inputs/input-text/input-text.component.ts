import { Component, forwardRef, Injector, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component'; 
import { ConstPath } from '../../../../../constants/const_path';
import { InputSizeEnum } from '../../../../../types/enum/inputSizeEnum';
import { SharedImports } from '../../../../../shared/shared-modules';

@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  imports: [SharedImports],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent
  extends FormControlValueAccessorConnector
  implements OnInit, OnChanges, ControlValueAccessor
{
  private readonly _disabled = signal<boolean>(false);
  private readonly _size = signal<InputSizeEnum>(InputSizeEnum.Base);
  private readonly _className = signal<string>('');
  private readonly _icon = signal<string | undefined>(undefined);
  private readonly _isValid = signal<boolean | undefined>(true);
  private readonly _errorMessage = signal<string>('');
  private readonly _isTooltip = signal<boolean>(false);
  private readonly _isRequired = signal<boolean | undefined>(false);

  readonly sizeClass = computed(() => `input-text-${this._size()}`);

  readonly InputSizeEnum = InputSizeEnum;
  readonly Icons = ConstPath;

  constructor() {
    super(inject(Injector));
  }
  
  @Input()
  set size(value: InputSizeEnum) {
    this._size.set(value);
  }
  
  @Input()
  set className(value: string) {
    this._className.set(value);
  }

  @Input()
  set icon(value: string | undefined) {
    this._icon.set(value);
  }

  @Input()
  set isValid(value: boolean | undefined) {
    this._isValid.set(value);
  }

  @Input()
  set errorMessage(value: string) {
    this._errorMessage.set(value);
  }

  @Input()
  set isTooltip(value: boolean) {
    this._isTooltip.set(value);
  }
  
  @Input()
  set isRequired(value: boolean | undefined) {
    this._isRequired.set(value);
  }
  
  @Input()
  set disabled(value: boolean) {
    this._disabled.set(value);
    this.setDisabledState(value);
  }

  get disabled(): boolean {
    return this._disabled();
  }

  get size(): InputSizeEnum {
    return this._size();
  }

  get className(): string {
    return this._className();
  }

  get icon(): string | undefined {
    return this._icon();
  }

  get isValid(): boolean | undefined {
    return this._isValid();
  }

  get errorMessage(): string {
    return this._errorMessage();
  }

  get isTooltip(): boolean {
    return this._isTooltip();
  }

  get isRequired(): boolean | undefined {
    return this._isRequired();
  }

  getTooltipContent(): string {
    return `על הסיסמה להיות:
הסיסמה לא תקטן מ8 תווים ולא תגדל מ16
שימוש בלפחות אות גדולה אחת (a-z)
שימוש בלפחות אות קטנה אחת (a-z)
שימוש בלפחות ספרה אחת (0-9)
שימוש בתו מיוחד אחד (!, @, #, $, %, ^, &, *)`;
  }

  ngOnInit(): void {
    try {
      this.checkConnectedField();
    } catch (error) {
      if (!this.formControl) {
        this.formControl = new FormControl('');
      }
    }
    this.setDisabledState(this.disabled);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.setDisabledState(this.disabled);
    }
  }
}
