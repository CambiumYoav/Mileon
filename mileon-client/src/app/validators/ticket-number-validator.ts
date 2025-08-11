import {AbstractControl, ValidationErrors} from "@angular/forms";

export function ticketNumberValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value || '';
  const strippedValue = value.replace(/-/g, ''); // Remove hyphens
  const isValid = /^\d{4,13}$/.test(strippedValue); // Check if it's between 4 and 13 digits
  return isValid ? null : { invalidTicketNumber: true };
}
