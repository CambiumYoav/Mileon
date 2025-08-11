import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function hoursRange(fromControlName: string, toControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromTimeControl = control.get(fromControlName);
    const toTimeControl = control.get(toControlName);
    if (!fromTimeControl || !toTimeControl) {
      console.warn(`hoursRange validator: Controls named "${fromControlName}" and/or "${toControlName}" not found`);
      return null;
    }

    const fromTime = fromTimeControl.value;
    const toTime = toTimeControl.value;

    if (fromTime && toTime) {
      let fromTimetDate = new Date();
      let toTimetDate = new Date();

      fromTimetDate.setHours(fromTime.split(':')[0]);
      fromTimetDate.setMinutes(fromTime.split(':')[1]);
      toTimetDate.setHours(toTime.split(':')[0]);
      toTimetDate.setMinutes(toTime.split(':')[1]);
      return (fromTimetDate >= toTimetDate) ? { hoursRange: true } : null;
    }

    return null;
  };
}

export function dateRange(fromControlName: string, toControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const fromDateControl = control.get(fromControlName);
    const toDateControl = control.get(toControlName);

    if (!fromDateControl || !toDateControl) {
      console.warn(`dateRange validator: Controls named "${fromControlName}" and/or "${toControlName}" not found`);
      return null;
    }

    const fromDate = fromDateControl.value;
    const toDate = toDateControl.value;

    if (fromDate && toDate) {
      const fromDateTime = new Date(fromDate);
      const toDateTime = new Date(toDate);

      if (fromDateTime >= toDateTime) {
        return { dateRange: true };
      }
    }

    return null;
  };
}

