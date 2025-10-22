// validators/date.validators.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function forbiddenWeekdaysValidator(disallowed: number[] = [5, 6]): ValidatorFn {
  // 0=Sunday ... 5=Friday, 6=Saturday
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) return null; 

    let d: Date | null = null;

    if (v instanceof Date) {
      d = v;
    } else if (typeof v === 'string') {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
      if (m) d = new Date(+m[1], +m[2] - 1, +m[3]);
      else {
        const parsed = new Date(v);
        if (!isNaN(parsed.getTime())) d = parsed;
      }
    }

    if (!d || isNaN(d.getTime())) return { invalidDate: true };

    const dow = d.getDay(); // 0..6
    return disallowed.includes(dow) ? { weekend: { day: dow } } : null;
  };
}
