// import {
//   ChangeDetectionStrategy,
//   Component,
//   EventEmitter,
//   forwardRef,
//   Input,
//   OnChanges,
//   OnInit,
//   Output,
// } from '@angular/core';
// import { MaterialModule } from '../../../../../shared/material-module';
// import { CommonModule } from '@angular/common';
// import {
//   FormsModule,
//   ReactiveFormsModule,
//   NG_VALUE_ACCESSOR,
//   NG_VALIDATORS,
//   ControlValueAccessor,
//   AbstractControl,
//   ValidationErrors,
//   Validator,
// } from '@angular/forms';
// import { FormControlValueAccessorConnector } from '../../../abstract/form-control-value-accessor-connector.component';
// import { InputTextComponent } from '../input-text/input-text.component';
// import { CheckboxComponent } from '../../checkbox/checkbox.component';
// export interface CheckboxWithText {
//   name: string;
//   isRequired: boolean;
// }

// @Component({
//   selector: 'app-input-checkbox-with-text',
//   templateUrl: './input-checkbox-with-text.component.html',
//   styleUrl: './input-checkbox-with-text.component.scss',
//   imports: [
//     CommonModule,
//     FormsModule,
//     ReactiveFormsModule,
//     ...MaterialModule,
//     InputTextComponent,
//     CheckboxComponent,
//   ],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   standalone: true,
//   providers: [
//     {
//       provide: NG_VALUE_ACCESSOR,
//       useExisting: forwardRef(() => InputCheckboxWithTextComponent),
//       multi: true,
//     },
//     {
//       provide: NG_VALIDATORS,
//       useExisting: forwardRef(() => InputCheckboxWithTextComponent),
//       multi: true,
//     },
//   ],
// })
// export class InputCheckboxWithTextComponent
//   implements ControlValueAccessor, Validator
// {
//   @Input() label = '';
//   @Input() required = false;
//   @Output() valueChange = new EventEmitter<{
//     checked: boolean;
//     text: string;
//   }>();

//   value: CheckboxWithText = { name: '', isRequired: false };
//   isDisabled = false;

//   private onChange: (v: CheckboxWithText) => void = () => {};
//   public onTouched: () => void = () => {};

//   writeValue(v: CheckboxWithText | null): void {
//     this.value = v ?? { name: '', isRequired: false };
//   }

//   registerOnChange(fn: (v: CheckboxWithText) => void): void {
//     this.onChange = fn;
//   }

//   registerOnTouched(fn: () => void): void {
//     this.onTouched = fn;
//   }

//   setDisabledState(disabled: boolean): void {
//     this.isDisabled = disabled;
//   }

//   onCheckedChange(checked: boolean) {
//     const next = { ...this.value, isRequired: checked };
//     this.value = next;
//     this.onChange(next);
//     this.onTouched();

//     // Emit the change event
//     this.valueChange.emit({
//       checked: checked,
//       text: this.value.name,
//     });
//   }

//   onTextChange(evt: Event) {
//     const text = (evt.target as HTMLInputElement).value;
//     const next = { ...this.value, name: text };
//     this.value = next;
//     this.onChange(next);
//     this.onTouched();

//     // Emit the change event
//     this.valueChange.emit({
//       checked: this.value.isRequired,
//       text: text,
//     });
//   }

//   validate(control: AbstractControl): ValidationErrors | null {
//     const value = control.value as CheckboxWithText;

//     // If checkbox is checked but name is empty or blank, return validation error
//     if (value && value.isRequired && this.isBlank(value.name)) {
//       return { nameRequiredWhenChecked: true };
//     }
//     if (value.name.length > 30) {
//       return { nameExceedsMaxLength: true };
//     }

//     return null;
//   }

//   isBlank(s: string | null | undefined): boolean {
//     return !s || s.trim().length === 0;
//   }

//   // Helper method to check if this field has validation errors

//   // Add this getter to your component class
//   get hasAnyError(): boolean {
//     return this.hasError || this.hasLenError;
//   }

//   // Keep your existing getters
//   get hasError(): boolean {
//     return this.value.isRequired && this.isBlank(this.value.name);
//   }

//   get hasLenError(): boolean {
//     return this.value.name.length > 30;
//   }
// }
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  signal,
  computed,
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import { CheckboxComponent } from '../../checkbox/checkbox.component';
import { InputTextComponent } from '../input-text/input-text.component';

export interface CheckboxWithText {
  name: string;
  isRequired: boolean;
}
@Component({
  selector: 'app-input-checkbox-with-text',
  templateUrl: './input-checkbox-with-text.component.html',
  styleUrls: ['./input-checkbox-with-text.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputCheckboxWithTextComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => InputCheckboxWithTextComponent),
      multi: true,
    },
  ],
  imports: [InputTextComponent, CheckboxComponent],
})
export class InputCheckboxWithTextComponent
  implements ControlValueAccessor, Validator
{
  @Input() label = '';
  @Input() required = false;
  @Output() valueChange = new EventEmitter<{
    checked: boolean;
    text: string;
  }>();

  // --- Signal State ---
  // 1. Internal value (replaces `this.value`)
  value = signal<CheckboxWithText>({ name: '', isRequired: false });

  // 2. Disabled state (replaces `this.isDisabled`)
  isDisabled = signal(false);

  // --- Callbacks (Must remain primitives for CVA) ---
  private onChange: (v: CheckboxWithText) => void = () => {};
  public onTouched: () => void = () => {};

  // --- Computed Validation ---
  private isBlank(s: string | null | undefined): boolean {
    return !s || s.trim().length === 0;
  }

  // Replaces get hasError()
  hasError = computed(() => {
    const current = this.value();
    return current.isRequired && this.isBlank(current.name);
  });

  // Replaces get hasLenError()
  hasLenError = computed(() => this.value().name.length > 30);

  // Replaces get hasAnyError()
  hasAnyError = computed(() => this.hasError() || this.hasLenError());

  // --- ControlValueAccessor Implementation ---

  // Use .set() to update the signal when the parent form writes to it
  writeValue(v: CheckboxWithText | null): void {
    this.value.set(v ?? { name: '', isRequired: false });
  }

  registerOnChange(fn: (v: CheckboxWithText) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Use .set() to update the signal when the disabled state changes
  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  // --- Event Handlers ---

  onCheckedChange(checked: boolean) {
    // 1. Use .update() to create the new state
    this.value.update((current) => ({ ...current, isRequired: checked }));

    // 2. Notify the Forms system with the current value
    this.onChange(this.value());
    this.onTouched();

    // 3. Emit the public event
    this.valueChange.emit({
      checked: checked,
      text: this.value().name,
    });
  }

  onTextChange(evt: Event) {
    const text = (evt.target as HTMLInputElement).value;

    // 1. Use .update() to create the new state
    this.value.update((current) => ({ ...current, name: text }));

    // 2. Notify the Forms system with the current value
    this.onChange(this.value());
    this.onTouched();

    // 3. Emit the public event
    this.valueChange.emit({
      checked: this.value().isRequired,
      text: text,
    });
  }

  // --- Validator Implementation (Remains the same) ---

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as CheckboxWithText;

    if (value && value.isRequired && this.isBlank(value.name)) {
      return { nameRequiredWhenChecked: true };
    }
    if (value.name.length > 30) {
      return { nameExceedsMaxLength: true };
    }

    return null;
  }
}
