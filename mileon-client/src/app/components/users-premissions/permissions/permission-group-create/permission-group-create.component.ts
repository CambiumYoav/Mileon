import { Component, Inject, OnInit, signal, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../../types/enum/error-success-messages';
import { DynamicField } from '../../../../types/infrastructure/InfrastructureTypes';
import { ButtonComponent } from "../../../shared/base/button/button.component";
import { InputTextComponent } from "../../../shared/base/inputs/input-text/input-text.component";

@Component({
  selector: 'app-permission-group-create',
  templateUrl: './permission-group-create.component.html',
  styleUrls: ['./permission-group-create.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputTextComponent]
})
export class PermissionGroupCreateComponent implements OnInit {
  readonly Icons = ConstPath; // Path to icons
  
  // Signals for reactive state
  title = signal<string>('');
  fields = signal<DynamicField[]>([]);
  isSubmitted = signal<boolean>(false);
  isModalOpen = signal<boolean>(false);
  
  // Output signal for form data
  formData = output<{ form: any; isEdit: boolean }>();
  
  // Computed signals
  dynamicForm = signal<FormGroup | null>(null);
  isFormValid = computed(() => this.dynamicForm()?.valid ?? false);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<PermissionGroupCreateComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicField[]; // Dynamic fields
      title: string;
      isEdit: boolean;
    },
    private toaster: ToastrService
  ) {
    this.fields.set(data.form); // Initialize fields from injected data
    this.title.set(data.title); // Initialize title from injected data
  }

  ngOnInit(): void {
    this.createForm(); // Initialize the form on component load
  }

  /** Closes the dialog */
  onNoClick(): void {
    this.dialogRef.close();
  }

  /** Creates the reactive form dynamically based on fields */
  private createForm(): void {
    const formGroup = (this.fields() || []).reduce((group, field) => {
      group[field.name] = this.createFieldControl(field);
      return group;
    }, {} as { [key: string]: any });

    this.dynamicForm.set(this.fb.group(formGroup));
  }

  /** Creates a control for a single field */
  private createFieldControl(field: DynamicField): any {
    const validations = this.getFieldValidations(field);
    return [field.value ?? '', validations];
  }

  /** Retrieves validations for a specific field */
  private getFieldValidations(field: DynamicField): ValidatorFn[] {
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

  /** Handles form submission */
  onSubmit(): void {
    const form = this.dynamicForm();
    console.log(form);
    
    if (form?.valid) {
      this.formData.emit({
        form: form.value,
        isEdit: this.data.isEdit,
      }); // Emit form data if valid
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', form);
      this.isSubmitted.set(true); // Mark form as submitted to show validation errors
    }
  }
}
