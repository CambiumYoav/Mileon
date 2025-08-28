import { Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConstPath } from '../../../../../constants/const_path'; 
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { SharedImports } from '../../../../../shared/shared-modules';
import { HebrewDateService } from '../../../../../services/hebrew-date.service';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  imports: [SharedImports],

  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
    ...HebrewDateService.getProviders()
  ],
})
export class InputDateComponent
  extends FormControlValueAccessorConnector
  implements OnInit, ControlValueAccessor
{
  calendarImg = ConstPath.CELANDER;
  @Input()
  isValid: boolean | undefined = true;

  // Set startAt to current date to ensure proper calendar rendering
  startAt = new Date();

  constructor(injector: Injector, private toastr: ToastrService) {
    super(injector);
  }

  ngOnInit(): void {}

  get isInvalid(): boolean {
    return (
      this.control?.invalid && (this.control?.dirty || this.control?.touched)
    );
  }

  public onBlur(): void {
    if (this.isInvalid) {
      // this.toastr.error(ErrorSuccessMessages.INVALID_TIME_RANGE);
    }
  }

  // Modified dateClass function to show all dates but style outside-month dates differently
  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const currentDate = new Date();
      const activeMonth = this.control?.value
        ? new Date(this.control.value).getMonth()
        : currentDate.getMonth();
      const activeYear = this.control?.value
        ? new Date(this.control.value).getFullYear()
        : currentDate.getFullYear();

      // Check if the date is from a different month/year
      if (cellDate.getMonth() !== activeMonth || cellDate.getFullYear() !== activeYear) {
        return 'outside-month';
      }
    }
    return '';
  };
}



