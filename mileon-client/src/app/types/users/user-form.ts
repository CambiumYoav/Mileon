import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';
import { Patterns } from 'src/app/validators/validationPatterns';
export class UserForm {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  id: string;
  phone: string;
  password: string;
  appAccess: string;
  dataAccess: string;
  automationGeneralCode: number;
  automationParkingCode: number;
  signFile: string;
  groupsAssign: string;
  groupAccess: string;
  constructor(args: UserForm) {
    this.email = args.email;
    this.userName = args.userName;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.id = args.id;
    this.phone = args.phone;
    this.password = args.password;
    this.appAccess = args.appAccess;
    this.dataAccess = args.dataAccess;
    this.automationGeneralCode = args.automationGeneralCode;
    this.automationParkingCode = args.automationParkingCode;
    this.signFile = args.signFile;
    this.groupsAssign = args.groupsAssign;
    this.groupAccess = args.groupAccess;
  }
}

export const usersValidation = {
  email: [Validators.pattern(Patterns.EMAIL), Validators.required],
  userName: [Validators.required, Validators.pattern(/^[A-Za-z]{4,14}$/)],

  firstName: [
    Validators.pattern(/^[A-Za-z\u0590-\u05FF ]{2,14}$/),
    Validators.required,
  ],

  lastName: [
    Validators.pattern(/^[A-Za-z\u0590-\u05FF -]{2,14}$/),
    Validators.required,
  ],
  id: [
    Validators.pattern(Patterns.ID),
    Validators.required,
    israeliIdValidator(),
  ],
  phone: [Validators.pattern(Patterns.PHONE_NUMBER), Validators.required],
  password: [Validators.pattern(Patterns.PASSWORD), Validators.required],
  automationGeneralCode: [
    Validators.pattern(Patterns.ONLY_NUMBERS),
    Validators.required,
  ],
  automationParkingCode: [
    Validators.pattern(Patterns.ONLY_NUMBERS),
    Validators.required,
  ],
  appAccess: [Validators.required, Validators.minLength(1)],
  groupAccess: [Validators.required],
  dataAccess: [Validators.required, Validators.minLength(1)],
};

export class UserNationalForm {
  email: string;
  userName: string;
  firstName: string;
  lastName: string;
  id: string;
  phone: string;
  password: string;

  constructor(args: UserForm) {
    this.email = args.email;
    this.userName = args.userName;
    this.firstName = args.firstName;
    this.lastName = args.lastName;
    this.id = args.id;
    this.phone = args.phone;
    this.password = args.password;
  }
}

export function israeliIdValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const id = control.value;

    // Check if value exists and is a string of 9 digits
    if (!id || !/^\d{9}$/.test(id)) {
      return { invalidIsraeliId: true };
    }

    // Calculate check digit
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = parseInt(id.charAt(i), 10);

      // For even positions (0-based index)
      if (i % 2 === 0) {
        sum += digit;
      }
      // For odd positions
      else {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
        sum += digit;
      }
    }

    // Valid ID if sum is divisible by 10
    return sum % 10 === 0 ? null : { invalidIsraeliId: true };
  };
}
