import { ValidatorFn } from "@angular/forms";

export interface FormControlOptions {
    disabled?: boolean;
    validation?: ValidatorFn[] | ValidatorFn; 
}

export interface ControlOptionsDictionary {
  [key: string]: FormControlOptions;
}