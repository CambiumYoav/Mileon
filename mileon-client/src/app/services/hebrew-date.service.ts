import { Injectable } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
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
@Injectable()
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

  // Override firstDayOfWeek to start with Sunday (0) for Hebrew calendar
  override getFirstDayOfWeek(): number {
    return 0; // Sunday
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

// Service to provide consistent Hebrew date providers
@Injectable({
  providedIn: 'root'
})
export class HebrewDateService {
  static getProviders() {
    return [
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
    ];
  }
}
