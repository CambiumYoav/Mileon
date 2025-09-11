import { Component, Inject, signal, inject } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  ValidatorFn,
  Validators,
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
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { SelectComponent } from "../../shared/base/select/select.component";
import { MatSelectModule } from "@angular/material/select";
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { SharedImports } from '../../../shared/shared-modules';  
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { TerminalErrorsMessages } from '../../../types/enum/terminalEnum';


@Component({
  selector: 'app-terminal-ticket-books-form',
  templateUrl: './terminal-ticket-books-form.component.html',
  styleUrls: ['./terminal-ticket-books-form.component.scss'],
  standalone: true,
  imports: [
    SharedImports,
    SelectComponent, 
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatOptionModule,
    ButtonComponent,
    InputTextComponent,
    InputDateComponent
  ],
})
export class TerminalTicketBooksFormComponent {
  readonly Icons = ConstPath;

  private readonly _title = signal<string>('');
  private readonly _rows = signal<DynamicRow[]>([]);
  private readonly _isSubmitted = signal<boolean>(false);
  private readonly _formData = signal<any>(null);
  private readonly _isSigns = signal<boolean>(false);
  private readonly _selectedFiles = signal<File | null>(null);
  private readonly _base64File = signal<any>(null);
  private readonly _fileTypes = signal<IdValuePair[]>([]);
  private readonly _filesToUpload = signal<UploadedFile[]>([]);
  private readonly _isTransfer = signal<boolean>(false);

  get title(): string {
    return this._title();
  }

  get rows(): DynamicRow[] {
    return this._rows();
  }

  get isSubmitted(): boolean {
    return this._isSubmitted();
  }

  get formData(): any {
    return this._formData();
  }

  get isSigns(): boolean {
    return this._isSigns();
  }

  get selectedFiles(): File | null {
    return this._selectedFiles();
  }

  get base64File(): any {
    return this._base64File();
  }

  get fileTypes(): IdValuePair[] {
    return this._fileTypes();
  }

  get filesToUpload(): UploadedFile[] {
    return this._filesToUpload();
  }

  get isTransfer(): boolean {
    return this._isTransfer();
  }

  dynamicForm!: FormGroup;
  FileType = FileType;

  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(MatDialogRef<TerminalTicketBooksFormComponent>);
  public readonly data = inject<{
    form: DynamicRow[];
    title: string;
    isTransfer: boolean;
  }>(MAT_DIALOG_DATA);
  private readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);

  constructor() {
    this._rows.set(this.data.form);
    this._title.set(this.data.title);
    this._isTransfer.set(this.data.isTransfer);
  }
  optionsApps: CheckboxOption[] = [
    { value: true, label: 'פעיל', checked: true },
  ];
  ngOnInit(): void {
    this.createForm();
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }


  private createForm(): void {
    const formGroup = this.rows.reduce((group, dynamicRow) => {
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

    // Handle disabled state for specific fields
    const isDisabled = field.name === 'isActive';
    const controlValue = field.value ?? '';
    
    return [isDisabled ? { value: controlValue, disabled: true } : controlValue, validations];
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
      const formValue = {
        form: this.dynamicForm.value,
      };
      this._formData.set(formValue); // Set form data signal
      this.dialogRef.close(formValue); // Close dialog with result
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this._isSubmitted.set(true); // Mark form as submitted to show validation errors
    }
  }

  /** Gets error message for a specific field */
  getFieldErrorMessage(fieldName: string): string {
    const control = this.dynamicForm.get(fieldName);
    if (control?.errors && (control.touched || this.isSubmitted)) {
      if (control.errors['required']) {
        return TerminalErrorsMessages.REQUIRED_FIELD; 
      }
      if (control.errors['minlength']) {
        return `${TerminalErrorsMessages.MIN_LENGTH} ${control.errors['minlength'].requiredLength} ${TerminalErrorsMessages.CHARACTERS}`;
      }
      if (control.errors['maxlength']) {
        return `${TerminalErrorsMessages.MAX_LENGTH} ${control.errors['maxlength'].requiredLength} ${TerminalErrorsMessages.CHARACTERS}`; 
      }
      if (control.errors['pattern']) {
        return TerminalErrorsMessages.PATTERN;
      }
      if (control.errors['min']) {
        return `${TerminalErrorsMessages.MIN} ${control.errors['min'].min}`;
      }
      if (control.errors['max']) {
        return `${TerminalErrorsMessages.MAX} ${control.errors['max'].max}`;
      }
    }
    return '';
  }
}
