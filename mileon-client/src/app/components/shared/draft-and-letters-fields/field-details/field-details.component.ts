import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  signal,
  computed,
  effect,
  inject,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { DraftsAndLettersForms } from '../../../../types/drafts-and-letters/draft-and-letters-forms';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { DynamicRow } from '../../../../types/infrastructure/InfrastructureTypes';
import { ConstPath } from '../../../../constants/const_path';
import { AuthorityService } from '../../../../services/authority.service ';
import { CheckboxOption } from '../../base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { DraftsAndLettersTypes } from '../../../../types/enum/draftAndLetters.enum';
import { SelectComponent } from '../../base/select/select.component';
import { InputCheckboxOptionGroupComponent } from '../../base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';

@Component({
  selector: 'app-field-details',
  templateUrl: './field-details.component.html',
  styleUrls: ['./field-details.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectComponent,
    InputCheckboxOptionGroupComponent,
  ],
})
export class FieldDetailsComponent implements OnInit, OnChanges {
  @Input() isDraft: boolean = false;
  @Input() isEdit = false;
  Icons = ConstPath;
  
  private readonly _rows = signal<DynamicRow[]>([]);
  private readonly _isSubmitted = signal<boolean>(false);
  private readonly _isIndictmentValue = signal<boolean | null>(null);
  
  readonly rows = computed(() => this._rows());
  readonly isSubmitted = computed(() => this._isSubmitted());
  readonly isIndictmentValue = computed(() => this._isIndictmentValue());
  
  @Output() formSubmitted = new EventEmitter<any>();
  @Output() isIndictmentChanged = new EventEmitter<boolean>();
  
  dynamicForm!: FormGroup;
  
  optionsTicketTypes: CheckboxOption[] = [
    { value: 2, label: 'חניה', checked: false },
    { value: 3, label: 'כללי', checked: false },
    { value: 1, label: 'מנהלי', checked: false },
  ];

  private readonly fb = inject(FormBuilder);
  private readonly toaster = inject(ToastrService);
  private readonly authorityService = inject(AuthorityService);
  
  private readonly authorityID = toSignal(this.authorityService.authorityId$, { initialValue: null });

  ngOnInit(): void {
    const form = new DraftsAndLettersForms();
    if (this.isDraft) {
      this._rows.set(form.DraftDetailsForm);
    } else {
      this._rows.set(this.isEdit ? form.DetailsForm : form.DetailsForm);
    }

    effect(() => {
      const authorityID = this.authorityID();
      if (authorityID !== null) {
        this._rows.update(rows => 
          rows.map(row => ({
            ...row,
            row: row.row.map(field => {
              if (field.name === 'authorityID') {
                return { ...field, value: authorityID?.toString() };
              }
              if (field.name === 'draftsAndLettersTypeId') {
                return { 
                  ...field, 
                  value: this.isDraft
                    ? DraftsAndLettersTypes.Draft
                    : DraftsAndLettersTypes.Letter
                };
              }
              return field;
            })
          }))
        );
      }
    }, { allowSignalWrites: true });

    this.createForm(); // Initialize the form on component load
    
    effect(() => {
      const control = this.dynamicForm?.get('isIndictment');
      if (control) {
        const currentValue = control.value;
        this._isIndictmentValue.set(currentValue);
        this.isIndictmentChanged.emit(currentValue);
      }
    }, { allowSignalWrites: true });
  }

  patchFormWithData(data: any) {
    this._rows.update(rows => 
      rows.map(row => ({
        ...row,
        row: row.row.map(field => {
          const key = field.name;
          if (data[key] !== undefined) {
            return { ...field, value: data[key] };
          }
          return field;
        })
      }))
    );
    this.updateFormField(data);
    this.createForm(); 
  }

  private updateFormField(data: any) {
    if (
      this.optionsTicketTypes &&
      Array.isArray(data.draftsAndLettersTicketTypes)
    ) {
      this.optionsTicketTypes.forEach((option) => {
        option.checked = data.draftsAndLettersTicketTypes.includes(
          option.value
        );
      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSubmitted'] && changes['isSubmitted'].currentValue === true) {
      this.onSubmit();
    }
    if (changes['rows'] || changes['triggerFormRecreation']) {
      if (this.rows() && this.rows().length > 0) {
        this.createForm();
      }
    }
    if (changes['isIndictmentValue'] && this.dynamicForm) {
      const control = this.dynamicForm.get('isIndictment');
      if (control) {
        control.setValue(this.isIndictmentValue(), { emitEvent: false });
      }
    }
  }
  /** Creates the reactive form dynamically based on rows and fields */
  public createForm(): void {
    const formGroup = this.rows().reduce((group, dynamicRow) => {
      dynamicRow.row.forEach((field) => {
        group[field.name] = this.createFieldControl(field);
      });
      return group;
    }, {} as { [key: string]: any });

    this.dynamicForm = this.fb.group(formGroup);
  }

  private createFieldControl(field: any): any {
    const validations = this.getFieldValidations(field);

    return [field.value ?? '', validations];
  }

  /** Retrieves validations for a specific field */
  private getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const { validations: fieldValidations } = field;

    if (fieldValidations) {
      if (fieldValidations.required) validations.push(Validators.required);
      if (fieldValidations.maxLength)
        validations.push(Validators.maxLength(fieldValidations.maxLength));
      if (fieldValidations.minLength)
        validations.push(Validators.minLength(fieldValidations.minLength));
      if (fieldValidations.pattern)
        validations.push(Validators.pattern(fieldValidations.pattern));
      if (fieldValidations.min !== undefined)
        validations.push(Validators.min(fieldValidations.min));
      if (fieldValidations.max !== undefined)
        validations.push(Validators.max(fieldValidations.max));
    }

    return validations;
  }

  isFieldValid(name: string): boolean {
    const control = this.dynamicForm.get(name);

    if (!control || control.disabled) return true;
    return control.touched ? control.valid : true;
  }

  /** Handles form submission */
  onSubmit(): void {
    const emissionData = {
      form: this.dynamicForm,
      isValid: this.dynamicForm.valid,
      status: this.dynamicForm.status,
    };
    this._isSubmitted.set(true);
    console.log('Form submitted:', this.dynamicForm);

    if (!this.dynamicForm.valid) {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS);
      this.markAllFieldsAsTouched();
    } else {
      this.formSubmitted.emit(emissionData);
      console.log('Form is valid, no toast needed');
    }
  }

  /** Mark all form fields as touched to trigger validation display */
  private markAllFieldsAsTouched(): void {
    Object.keys(this.dynamicForm.controls).forEach((key) => {
      const control = this.dynamicForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  public setIsIndictment(value: boolean) {
    const control = this.dynamicForm?.get('isIndictment');
    if (control) {
      control.setValue(value, { emitEvent: false });
      this._isIndictmentValue.set(value);
    }
  }

  onSelectionChange(selectedValues: any[], fieldName: string): void {
    const control = this.dynamicForm.get(fieldName);
    if (control) {
      control.setValue(selectedValues);
      control.markAsDirty(); //  force dirty
    }
  }

  public isDirty(): boolean {
    return this.dynamicForm?.dirty;
  }
}
