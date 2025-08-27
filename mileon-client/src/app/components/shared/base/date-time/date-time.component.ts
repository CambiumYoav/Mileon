import { Component, Injector, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { FormControlValueAccessorConnector } from '../../abstract/form-control-value-accessor-connector.component';
import {ToastrService} from "ngx-toastr";
import {ErrorSuccessMessages} from "../../../../types/enum/error-success-messages";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-date-time',
  templateUrl: './date-time.component.html',
  styleUrls: ['./date-time.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimeComponent),
      multi: true,
    },
  ],
  // host: {
  //   '(change)': 'func($event.target.value)',
  // },
})
export class DateTimeComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  constructor(injector: Injector, private toastr: ToastrService) {
    super(injector);
  }

  ngOnInit() {
  }

  onBlur() {
    if (this.control?.parent?.hasError('hoursRange')) {
      this.toastr.error(ErrorSuccessMessages.INVALID_TIME_RANGE);
    }
  }


}





