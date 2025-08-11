import { ValidatorFn, AbstractControl } from '@angular/forms';


export function arrayNotEmpty(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value as any[];
    // console.log('value' ,value , 'Array.isArray(value)' ,Array.isArray(value) , 'value.length' ,value.length)
    // console.log('arrray not empty:', 'value.length' ,value.length)

    if (value !== null && Array.isArray(value) && value.length > 0) {
      return null;
    }
    return { 'arrayNotEmpty': true };

  };
}