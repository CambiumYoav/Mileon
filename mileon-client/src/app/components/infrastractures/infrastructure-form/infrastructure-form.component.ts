import { Component, Inject, signal, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatDialogModule,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  FileType,
  FileUploadComponenetType,
} from '../../../types/enum/fileType.enum';
import { DynamicRow, FieldOption } from '../../../types/infrastructure/InfrastructureTypes';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { Utils } from '../../../utils/utils';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { InputCheckboxOptionGroupComponent } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputPhoneComponent } from '../../shared/base/inputs/input-phone/input-phone.component';
import { InputCheckboxComponent } from '../../shared/base/inputs/input-checkbox/input-checkbox.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { MaterialModule } from '../../../shared/material-module';
import { FormsModule } from '@angular/forms';
import { SelectService } from '../../shared/base/select/select.service';
import { LookupNewService } from '../../../services/lookup-new.service';
import { FileUploadNewComponent } from '../../shared/base/upload-files/upload-files.component';
import { RadioButtonComponent } from '../../shared/base/radio-button/radio-button.component';

@Component({
  selector: 'app-infrastructure-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule,
    MatDialogModule,
    ButtonComponent,
    InputTextComponent,
    InputCheckboxOptionGroupComponent,
    InputDateComponent,
    InputPhoneComponent,
    InputCheckboxComponent,
    SelectComponent,
    FileUploadNewComponent,
    RadioButtonComponent
  ],
  templateUrl: './infrastructure-form.component.html',
  styleUrls: ['./infrastructure-form.component.scss'],
})
export class InfrastructureFormComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<InfrastructureFormComponent>);
  private dialog = inject(MatDialog);
  private toaster = inject(ToastrService);
  private selectService = inject(SelectService);
  private lookupService = inject(LookupNewService);

  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly of = of;

  title = signal<string>('');
  rows = signal<DynamicRow[]>([]);
  dynamicForm!: FormGroup;
  isSubmitted = signal<boolean>(false);
  dataSubject = signal<any>(null);
  isSigns = signal<boolean>(false);
  selectedFiles = signal<File | null>(null);
  base64File = signal<any>(null);
  fileTypes = signal<IdValuePair[]>([]);
  filesToUpload = signal<UploadedFile[]>([]);
  isEdit = signal<boolean>(false);

  allowedFileTypes: FileType[] = [FileType.DOCX, FileType.PDF, FileType.JPG, FileType.DOC, FileType.PNG];
  maxFileSizeMB = 10; 

  optionsApps: CheckboxOption[] = [
    { value: true, label: 'פעיל', checked: true },
  ];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicRow[];
      title: string;
      isEdit: boolean;
      isSigns: boolean;
    }
  ) {
    this.rows.set(data.form);
    this.title.set(data.title);
    this.isSigns.set(data.isSigns);
    this.isEdit.set(data.isEdit);
    this.createForm();
    
    this.loadInspectorData();
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  private async loadInspectorData(): Promise<void> {
    try {
      const inspectorData = await this.lookupService.getAllInspectors();
      
      // Update SelectService with the loaded data
      const currentData = this.selectService.listsObj.value;
      this.selectService.listsObj.next({
        ...currentData,
        getAllInspectors: {
          linkedInspectors: inspectorData
        }
      });
    } catch (error) {
      console.error('Error loading inspector data:', error);
    }
  }

  private createForm(): void {
    const formGroup = this.rows().reduce((group: { [key: string]: any }, dynamicRow: any) => {
      dynamicRow.row.forEach((field: any) => {
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

    // Handle radio button values specially
    let controlValue = '';
    if (field.type === 'radio') {
      // Only set a value if we're in edit mode and have a valid value
      if (this.isEdit() && field.value !== undefined && field.value !== null) {
        controlValue = this.getRadioButtonValue(field.value);
        console.log(`Field: ${field.name}, Value: ${controlValue}`);
      }
    } else {
      // For non-radio fields, use the field value or empty string
      controlValue = field.value || '';
      console.log(`Field: ${field.name}, Value: ${controlValue}`);
    }

    // Create FormControl with proper disabled state
    const control = this.fb.control({
      value: controlValue,
      disabled: field.disabled || false
    }, validations);

    return control;
  }

  private isFromToField(field: any): boolean {
    return field.type === 'fromTo' && field.fields?.length > 0;
  }

  private createFromToGroup(field: any, validations: ValidatorFn[]): any {
    return this.fb.group({
      from: this.fb.control({
        value: field.fields[0]?.value || '',
        disabled: field.disabled || false
      }, validations),
      to: this.fb.control({
        value: field.fields[1]?.value || '',
        disabled: field.disabled || false
      }, validations),
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
    console.log('Form Submitted', this.dynamicForm.value);
    if (this.dynamicForm.valid) {
      const result = {
        form: this.dynamicForm.value,
        isEdit: this.data.isEdit,
        uploadedFiles: this.base64File(),
      };
      
      // Close dialog with result
      this.dialogRef.close(result);
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this.isSubmitted.set(true);
    }
  }

  onFileSelected(file: File): void {
    if (!file) {
      console.warn('No file selected');
      return;
    }

    this.selectedFiles.set(file);
    
    Utils.convertFileToBase64(file)
      .then((base64: string) => {
        this.base64File.set(base64);
      })
      .catch((error) => {
        console.error('Error converting file to Base64:', error);
      });
  }
  toJSON(data: any): string {
    return JSON.stringify(data);
  }

  /**
   * Transforms field options from {value, display} format to {value, label} format
   * for compatibility with RadioButtonComponent
   */
  transformRadioOptions(options: FieldOption[] | undefined): any[] {
    if (!options || !Array.isArray(options)) return [];
    return options.map(option => ({
      value: String(option.value),
      label: option.display
    }));
  }

  getRadioButtonValue(fieldValue: any): string {
    // Handle different value formats from database
    if (typeof fieldValue === 'object' && fieldValue !== null) {
      // Try to find common ID properties
      if (fieldValue.genderID !== undefined) {
        return String(fieldValue.genderID);
      }
      if (fieldValue.id !== undefined) {
        return String(fieldValue.id);
      }
      if (fieldValue.value !== undefined) {
        return String(fieldValue.value);
      }
      // If no ID found, return empty string
      return '';
    }
    // Special handling for boolean values
    if (fieldValue === true) {
      return 'true';
    }
    if (fieldValue === false) {
      return 'false';
    }
    console.log(fieldValue)
    // Special handling for boolean-like numbers (0/1) for radio buttons
    // This ensures consistency if options are defined as true/false booleans
    if (fieldValue === 1) {
      return 'true';
    }
    if (fieldValue === 0) {
      return 'false';
    }
    
    // Handle other common boolean patterns
    if (fieldValue === 'Y' || fieldValue === 'y') {
      return 'true';
    }
    if (fieldValue === 'N' || fieldValue === 'n') {
      return 'false';
    }
    if (fieldValue === 'Yes' || fieldValue === 'yes') {
      return 'true';
    }
    if (fieldValue === 'No' || fieldValue === 'no') {
      return 'false';
    }
    
    // If it's a primitive value, convert to string
    return String(fieldValue || '');
  }
}
