import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { ControlOptionsDictionary } from '../../../types/formControlOptions';

@Injectable({
  providedIn: 'root',
})
export class BaseFormService {
  constructor(private fb: FormBuilder) {}

  createFormGroup(
    dynamicClass: any,
    controlOptions?: ControlOptionsDictionary,
    disabled?: boolean
  ): FormGroup {
    // create an object from dynamic class
    const dynamicObject = new dynamicClass({});

    // get the properties of the dynamic class
    const properties = Object.getOwnPropertyNames(dynamicObject);

    // create form controls for each property
    const formControls = properties.reduce(
      (controls: { [key: string]: FormControl }, property) => {
        // get the value of the property from the dynamic object
        const value = dynamicObject[property];
        const options = controlOptions ? controlOptions[property] : {};

        // create a form control or form group with the initial value of the property
        let control;
        if (Array.isArray(value)) {
          control = this.fb.array([]);
        } else if (typeof value === 'object') {
          control = new FormGroup({});
          for (let key in value) {
            const childControl = new FormControl(
              value[key],
              controlOptions?.[key]?.validation
            );
            control.addControl(key, childControl);
          }
        } else {
          control = new FormControl(value);
          if (options) {
            if (options.validation && options.validation.length > 0) {
              control.setValidators(options.validation);
            }
            if (options.disabled) {
              control.disable();
            }
          }
        }

        if (dynamicClass.validators && dynamicClass.validators[property]) {
          const validators = dynamicClass.validators[property];
          if (validators) {
            control.setValidators(validators);
          }
        }

        // add the control to the controls object
        controls[property] = control as FormControl;

        return controls;
      },
      {}
    );

    // create the form group with the form controls
    let formGroup = this.fb.group(formControls);
    if (disabled) {
      formGroup.disable();
    }
    return formGroup;
  }

  getObjectProperties(obj: any): string[] {
    let properties: string[] = [];
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (typeof obj[prop] === 'object') {
          properties.push(prop);
        } else {
          properties.push(prop);
        }
      }
    }
    return properties;
  }

  // add a validation to already existed form
  setValidations(formGroup: FormGroup, validations: any) {
    for (const controlName of Object.keys(validations)) {
      const control = formGroup.get(controlName);
      if (control) {
        control.setValidators(validations[controlName]);
      }
    }
  }

  // set the form control values to matched object values.
  // setObjectValuesToForm(object: any, formGroup: FormGroup): void {
  //   if(typeof object  !== 'object') return
  //   Object.keys(object).forEach((key) => {
  //     const control = formGroup.get(key);
  //     const value = object ? object[key]: null;

  //     if (control && value) {
  //       if (typeof value === 'object') {
  //         // If the value is an object, recursively set its values in a nested FormGroup
  //         if (control instanceof FormGroup) {
  //           this.setObjectValuesToForm(value, control);
  //         }
  //         if(control instanceof FormArray) {
  //           for(let i = 0; i < control.controls.length; i++ ) {
  //             this.setObjectValuesToForm(value[i], control.at(i) as FormGroup);
  //           }
  //         }
  //       } else {
  //         control.setValue(value);
  //       }
  //     }
  //   });
  // }
  setObjectValuesToForm(object: any, formGroup: FormGroup): void {
    if (!object || typeof object !== 'object') return;

    Object.keys(object).forEach((key) => {
      const control = formGroup.get(key);
      const value = object[key];

      if (!control || value === undefined || value === null) {
        return;
      }

      if (control instanceof FormGroup) {
        if (typeof value === 'object' && !Array.isArray(value)) {
          this.setObjectValuesToForm(value, control);
        }
        return;
      }

      if (control instanceof FormArray) {
        if (Array.isArray(value)) {
          if (control.length && typeof value[0] === 'object') {
            value.forEach((item, index) => {
              const childGroup = control.at(index);
              if (childGroup instanceof FormGroup) {
                this.setObjectValuesToForm(item, childGroup);
              } else if (childGroup instanceof FormControl) {
                childGroup.setValue(item);
              }
            });
          }
        }
        return;
      }

      // --- FormControl רגיל ---
      if (control instanceof FormControl) {
        control.setValue(value);
      }
    });
  }

  // build a form from object and sets the object values to the form default values.
  buildNestedForm(obj: any): FormGroup | FormArray | FormControl {
    if (Array.isArray(obj)) {
      // If it's an array, build a FormArray
      const formArray = this.fb.array([]);
      obj.forEach((item: any) => {
        if (typeof item === 'object') {
          formArray.push(this.buildNestedForm(item) as FormControl);
        } else {
          formArray.push(this.fb.control(item));
        }
      });
      return formArray;
    } else if (typeof obj === 'object' && obj !== null) {
      // If it's an object, build a FormGroup
      const formGroup: { [key: string]: any } = {};
      for (const key in obj) {
        formGroup[key] = this.buildNestedForm(obj[key]);
      }
      return this.fb.group(formGroup);
    } else {
      // For simple values, create a FormControl
      return this.fb.control(obj);
    }
  }

  // convert object to formData
  objectToFormData(obj: any, formData: FormData, parentKey?: string) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const propName = parentKey ? `${parentKey}.${key}` : key;
        const value = obj[key];
        if (value instanceof Date) {
          formData.append(propName, value.toISOString());
        }
        if (value instanceof File) {
          formData.append(propName, value, value.name);
        } else if (value instanceof Blob) {
          formData.append(propName, value);
        } else if (Array.isArray(value)) {
          if (value.length == 0) {
            formData.append(propName, 'null'); // Initialize an empty array
          } else {
            for (let i = 0; i < value.length; i++) {
              const arrayKey = `${propName}[${i}]`;
              this.objectToFormData(value[i], formData, arrayKey);
            }
          }
        } else if (typeof value === 'object') {
          this.objectToFormData(value, formData, propName);
        } else {
          if (value) {
            formData.append(propName, value);
          }
        }
      }
    }
  }
}
