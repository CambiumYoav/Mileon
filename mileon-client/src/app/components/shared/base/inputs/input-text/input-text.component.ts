import { Component, forwardRef, Injector, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
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
  inputSize: any;
  private _disabled: boolean = false;
  
  constructor(injector: Injector) {
    super(injector);
  }
  
  InputSizeEnum = InputSizeEnum;
  Icons = ConstPath;
  
  @Input()
  size: InputSizeEnum = InputSizeEnum.Base;
  
  @Input()
  className: string = '';

  @Input()
  icon?: string;

  @Input()
  isValid: boolean | undefined = true;

  @Input()
  errorMessage: string = '';

  @Input()
  isTooltip: boolean = false;
  
  @Input()
  isRequired: boolean | undefined = false;
  
  @Input()
  set disabled(value: boolean) {
    this._disabled = value;
    this.updateDisabledState();
  }
  
  get disabled(): boolean {
    return this._disabled;
  }

  get sizeClass(): string {
    return `input-text-${this.size}`;
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
      // If ControlContainer is not available, create a local FormControl
      if (!this.formControl) {
        this.formControl = new FormControl('');
      }
    }
    this.updateDisabledState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['disabled']) {
      this.updateDisabledState();
    }
  }

  private updateDisabledState(): void {
    if (this.formControl) {
      if (this._disabled) {
        this.formControl.disable();
      } else {
        this.formControl.enable();
      }
    }
  }
}
