import { Component, Inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { FileType } from '../../../types/enum/fileType.enum';
import { DynamicFieldSize } from '../../../types/enum/infrastructureTablesEnum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { ButtonComponent } from "../../shared/base/button/button.component";
import { SelectComponent } from "../../shared/base/select/select.component";
import { InputTextComponent } from "../../shared/base/inputs/input-text/input-text.component";
import { InputDateComponent } from "../../shared/base/inputs/input-date/input-date.component";
import { InputPhoneComponent } from "../../shared/base/inputs/input-phone/input-phone.component";
import { InputCheckboxComponent } from "../../shared/base/inputs/input-checkbox/input-checkbox.component";
import { InputCheckboxOptionGroupComponent } from "../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component";
import { RadioButtonComponent } from "../../shared/base/radio-button/radio-button.component";
import { CheckboxOption } from "../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component";
import { RadioOption } from "../../shared/base/radio-button/radio-button.component";
import { TextareaCommentsComponent } from "../../shared/base/inputs/textarea-comments/textarea-comments.component";
import { MaterialModule } from '../../../shared/material-module';
import { InputNumberComponent } from "../../shared/base/inputs/input-number/input-number.component";

@Component({
  selector: 'app-terminal-form',

  templateUrl: './terminal-form.component.html',
  styleUrls: ['./terminal-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    ButtonComponent,
    SelectComponent,
    InputTextComponent,
    InputDateComponent,
    InputPhoneComponent,
    InputCheckboxComponent,
    InputCheckboxOptionGroupComponent,
    RadioButtonComponent,
    TextareaCommentsComponent,
    InputNumberComponent
],
})
export class TerminalFormComponent {
  readonly Icons = ConstPath; 
  DynamicFieldSize = DynamicFieldSize;
  title = signal<string>(''); 
  rows = signal<DynamicRow[]>([]); 
  dynamicForm!: FormGroup; 
  isSubmitted = signal(false); 
  isSigns: boolean = false;
  selectedFiles: File | null = null;
  base64File: any;
  fileTypes: IdValuePair[] = [];
  filesToUpload: UploadedFile[] = [];
  FileType = FileType;
  isTransfer: boolean = false;
  buttonText = signal<string>('');
  dataSubject = signal<any>(null);

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TerminalFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicRow[];
      title: string;
      buttonText: string;
      isTransfer: boolean;
    },
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {
    this.rows.set(data.form);
    this.title.set(data.title);
    this.buttonText.set(data.buttonText);
    this.isTransfer = data.isTransfer;
  }

  ngOnInit(): void {
    this.createForm(); 
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }


  private createForm(): void {
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

    if (this.isFromToField(field)) {
      return this.createFromToGroup(field, validations);
    }

    return [field.value ?? '', validations];
  }

  private isFromToField(field: any): boolean {
    return field.type === 'fromTo' && field.fields?.length > 0;
  }

  private createFromToGroup(field: any, validations: ValidatorFn[]): any {
    return this.fb.group({
      from: [field.fields[0]?.value || '', validations],
      to: [field.fields[1]?.value || '', validations],
    });
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

  /** Handles form submission */
  onSubmit(): void {
    if (this.dynamicForm.valid) {
      // this.dialogRef.close({
      //   form: this.dynamicForm.value,
      // }); // Close dialog with form data if valid
      this.dataSubject.set(this.dynamicForm.value);
    } else {
      this.isSubmitted.set(true);
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      // this.isSubmitted = true; // Mark form as submitted to show validation errors
    }
  }

  // Map dynamic options to checkbox group options
  toCheckboxOptions(options: Array<{ value: any; display: string }> | undefined): CheckboxOption[] {
    return (options || []).map((o) => ({ value: o.value, label: o.display }));
  }

  // Map dynamic options to radio options
  toRadioOptions(options: Array<{ value: any; display: string }> | undefined): RadioOption[] {
    return (options || []).map((o) => ({ value: String(o.value), label: o.display }));
  }

  // Get current radio value as string for RadioButtonComponent
  getRadioValue(controlName: string): string {
    const val = this.dynamicForm?.get(controlName)?.value;
    return val !== undefined && val !== null ? String(val) : '';
  }
}
