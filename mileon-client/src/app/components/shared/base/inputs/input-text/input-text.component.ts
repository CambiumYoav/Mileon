import { Component, forwardRef, Injector, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component'; 
import { ConstPath } from '../../../../../constants/const_path';
import { SharedImports } from '../../../../../shared/shared-modules';
import { InputSizeEnum } from '../../../../../types/enum/inputSizeEnum';


@Component({
  selector: 'app-input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss'],
  standalone: true,
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
  implements OnInit, ControlValueAccessor
{
  inputSize: any;
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
  @Input() disabled: boolean = false;

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
    this.checkConnectedField();
  }
}
