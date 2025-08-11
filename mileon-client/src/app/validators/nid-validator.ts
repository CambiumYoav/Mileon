import {AbstractControl, ValidationErrors, ValidatorFn} from "@angular/forms";

export function israeliIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isValid = isValidIsraeliId(control.value)
    return isValid ? null : { 'invalidIsraeliId': true };
  };
}


function isValidIsraeliId(idNumber: string): boolean {
  idNumber = idNumber.padStart(9, '0'); // Pad with leading zeros if necessary

  if (!isNumeric(idNumber)) {
    return false;
  }

  let sum = 0;
  for (let i = 0; i < 8; i++) {
    let digit = parseInt(idNumber[i]);
    digit = (i % 2 !== 0) ? digit * 2 : digit;
    sum += (digit > 9) ? digit - 9 : digit;
  }

  const checksum = (10 - (sum % 10)) % 10;
  return parseInt(idNumber[8]) === checksum;
}


function isNumeric(value: string): boolean {
  return /^[0-9]*$/.test(value);
}
