import { Component, Injector, Input, OnInit, forwardRef } from '@angular/core';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ConstPath } from '../../../../../constants/const_path'; 
import { ErrorSuccessMessages } from '../../../../../types/enum/error-success-messages';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, registerLocaleData } from '@angular/common';
import { MatCalendarCellClassFunction, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS, NativeDateAdapter } from '@angular/material/core';
import he from '@angular/common/locales/he';

// Register Hebrew locale
registerLocaleData(he);

// Custom Hebrew date formats
export const HEBREW_DATE_FORMATS = {
  parse: {
    dateInput: { day: 'numeric', month: 'numeric', year: '2-digit' },
  },
  display: {
    dateInput: { day: 'numeric', month: 'numeric', year: '2-digit' },
    monthYearLabel: { year: 'numeric', month: 'short' },
    dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
    monthYearA11yLabel: { year: 'numeric', month: 'long' },
  },
};

// Custom Hebrew date adapter
export class HebrewDateAdapter extends NativeDateAdapter {
  override getMonthNames(style: 'long' | 'short' | 'narrow'): string[] {
    return [
      'ינואר', 'פברואר', 'מרץ', 'אפריל', 'מאי', 'יוני',
      'יולי', 'אוגוסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר'
    ];
  }

  override getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[] {
    return ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];
  }

  override getDateNames(): string[] {
    return Array.from({length: 31}, (_, i) => (i + 1).toString());
  }

  // Custom format method for DD/MM/YY format
  override format(date: Date, displayFormat: any): string {
    if (displayFormat === HEBREW_DATE_FORMATS.display.dateInput) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2); // Get last 2 digits
      return `${day}/${month}/${year}`;
    }
    return super.format(date, displayFormat);
  }
}

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDatepickerModule, MatInputModule, MatIconModule, MatFormFieldModule], 
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputDateComponent),
      multi: true,
    },
    {
      provide: MAT_DATE_LOCALE,
      useValue: 'he-IL'
    },
    {
      provide: DateAdapter,
      useClass: HebrewDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: HEBREW_DATE_FORMATS
    }
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



