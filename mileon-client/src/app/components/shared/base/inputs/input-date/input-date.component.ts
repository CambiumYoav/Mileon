import { Component, Injector, Input, OnInit, OnDestroy, forwardRef, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ConstPath } from '../../../../../constants/const_path'; 
import { ToastrService } from 'ngx-toastr';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material-module';
import { HebrewDateService } from '../../../../../services/hebrew-date.service';
import { DatePipe } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-input-date',
  templateUrl: './input-date.component.html',
  styleUrls: ['./input-date.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ...MaterialModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
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
  implements OnInit, OnDestroy, ControlValueAccessor
{ 
  private readonly _isValid = signal<boolean | undefined>(true);
  private readonly _isRequired = signal<boolean | undefined>(false);
  private readonly _errorMessage = signal<string>('');

  get isValid(): boolean | undefined {
    return this._isValid();
  }

  get isRequired(): boolean | undefined {
    return this._isRequired();
  }

  readonly calendarImg = ConstPath.CELANDER;
  readonly Icons = ConstPath;
  // Set startAt to current date to ensure proper calendar rendering
  readonly startAt = new Date();

  private readonly toastr = inject(ToastrService);
  private readonly datePipe = inject(DatePipe);
  private inputSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private currentInputElement: HTMLInputElement | null = null;

  @Input() set isValid(value: boolean | undefined) {
    this._isValid.set(value);
  }

  @Input() set isRequired(value: boolean | undefined) {
    this._isRequired.set(value);
  }

  @Input()
  set errorMessage(value: string) {
    this._errorMessage.set(value);
  }

  @Input() isWeekendBlocked: boolean = false;

  // Date filter functions
  allowAllDates = (date: Date | null): boolean => {
    return true;
  };

  noFriSat = (date: Date | null): boolean => {
    if (!date) return false;
    const day = date.getDay();
    return day !== 5 && day !== 6; // Block Friday (5) and Saturday (6)
  };

  constructor() {
    super(inject(Injector));
  }

  ngOnInit(): void {
    // Set up debounced input processing
    this.inputSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(value => {
        this.processInput(value);
      });
  }

  override ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get isInvalid(): boolean {
    return (
      this.control?.invalid && (this.control?.dirty || this.control?.touched)
    );
  }
  get errorMessage(): string {
    return this._errorMessage();
  }
  
  public onBlur(): void {
    if (this.isInvalid) {
      // this.toastr.error(ErrorSuccessMessages.INVALID_TIME_RANGE);
    }
  }
  

  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    
    // Store reference to current input element
    this.currentInputElement = input;
    
    // Emit the value to the debounced subject
    this.inputSubject.next(value);
  }

  public onKeyDown(event: KeyboardEvent): void {
    // Handle Enter key
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      
      // Process the current input value immediately
      const input = event.target as HTMLInputElement;
      const value = input.value;
      
      if (value) {
        this.processInput(value);
      }
    }
  }

  private processInput(value: string): void {
    // Check if the input is a 6-digit number (like 230325)
    if (/^\d{6}$/.test(value)) {
      this.parseAndSetDate(value);
    }
    // Also handle 8-digit format (like 23032025 for 23/03/2025)
    else if (/^\d{8}$/.test(value)) {
      this.parseAndSetDate8Digit(value);
    }
    // Handle formatted input like 12.3.45, 12/3/45, 12\3\45
    else if (/^\d{1,2}[./\\]\d{1,2}[./\\]\d{2,4}$/.test(value)) {
      this.parseFormattedDate(value);
    }
    // Handle partial input for better UX (only when not triggered by Enter)
    else if (/^\d{1,5}$/.test(value)) {
      // Don't process partial input, just let user continue typing
      return;
    }
    // Handle other potential date formats when Enter is pressed
    else if (value && this.isValidDateString(value)) {
      this.tryParseDate(value);
    }
  }

  private parseAndSetDate(value: string): void {
    try {
      // Parse format like 230325 -> 23/03/25
      const day = value.substring(0, 2);
      const month = value.substring(2, 4);
      const year = value.substring(4, 6);
      
      // Convert 2-digit year to 4-digit year
      // Assume years 00-30 are 2000-2030, years 31-99 are 1931-1999
      const fullYear = parseInt(year) <= 30 ? 2000 + parseInt(year) : 1900 + parseInt(year);
      
      this.setDateFromParts(parseInt(day), parseInt(month), fullYear);
    } catch (error) {
      this.toastr.error('שגיאה בעיבוד התאריך');
    }
  }

  private parseAndSetDate8Digit(value: string): void {
    try {
      // Parse format like 23032025 -> 23/03/2025
      const day = value.substring(0, 2);
      const month = value.substring(2, 4);
      const year = value.substring(4, 8);
      
      this.setDateFromParts(parseInt(day), parseInt(month), parseInt(year));
    } catch (error) {
      this.toastr.error('שגיאה בעיבוד התאריך');
    }
  }

  private parseFormattedDate(value: string): void {
    try {
      // Parse format like 12.3.45, 12/3/45, 12\3\45
      const parts = value.split(/[./\\]/);
      if (parts.length === 3) {
        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const yearStr = parts[2];
        
        let year: number;
        if (yearStr.length === 2) {
          // 2-digit year: convert to 4-digit
          const yearNum = parseInt(yearStr);
          year = yearNum <= 30 ? 2000 + yearNum : 1900 + yearNum;
        } else {
          // 4-digit year
          year = parseInt(yearStr);
        }
        
        this.setDateFromParts(day, month, year);
      }
    } catch (error) {
      this.toastr.error('שגיאה בעיבוד התאריך');
    }
  }

  private setDateFromParts(day: number, month: number, year: number): void {
    // Create date object
    const date = new Date(year, month - 1, day);
    
    // Validate the date
    if (this.isValidDate(date, day, month, year)) {
      // Format the date for display
      const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
      if (formattedDate) {
        // Update the current input element value to show the formatted date
        if (this.currentInputElement) {
          this.currentInputElement.value = formattedDate;
        }
        
        // Update the form control value
        if (this.control) {
          this.control.setValue(date);
          this.control.markAsTouched();
        }
      }
    } else {
      this.toastr.error('תאריך לא תקין');
    }
  }

  private isValidDate(date: Date, day: number, month: number, year: number): boolean {
    // Check if the date object is valid and matches the input values
    return date instanceof Date && 
           !isNaN(date.getTime()) && 
           date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
  }

  private isValidDateString(value: string): boolean {
    // Check if the string looks like it could be a date
    return /^\d+$/.test(value) || 
           /^\d{1,2}[./\\]\d{1,2}[./\\]\d{2,4}$/.test(value) ||
           /^\d{1,2}[./\\]\d{1,2}$/.test(value);
  }

  private tryParseDate(value: string): void {
    try {
      // Try to parse as a regular date string
      const date = new Date(value);
      if (this.isValidDateObject(date)) {
        this.setDateFromDateObject(date);
      } else {
        this.toastr.error('תאריך לא תקין');
      }
    } catch (error) {
      this.toastr.error('שגיאה בעיבוד התאריך');
    }
  }

  private isValidDateObject(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }

  private setDateFromDateObject(date: Date): void {
    // Format the date for display
    const formattedDate = this.datePipe.transform(date, 'dd/MM/yyyy');
    if (formattedDate) {
      // Update the current input element value to show the formatted date
      if (this.currentInputElement) {
        this.currentInputElement.value = formattedDate;
      }
      
      // Update the form control value
      if (this.control) {
        this.control.setValue(date);
        this.control.markAsTouched();
      }
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



