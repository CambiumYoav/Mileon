import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, of } from 'rxjs';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  FileType,
  FileUploadComponenetType,
} from '../../../types/enum/fileType.enum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { IdValuePair } from '../../../types/legalRequest/legal-request-file-type-response';
import { UploadedFile } from '../../../types/uploadedFile';
import { CheckboxOption } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';
import { Utils } from '../../../utils/utils';
import { BaseComponents, SharedImports } from '../../../shared/shared-modules';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
import { SelectComponent } from '../../shared/base/select/select.component';
import { InputDateComponent } from '../../shared/base/inputs/input-date/input-date.component';
import { InputPhoneComponent } from '../../shared/base/inputs/input-phone/input-phone.component';
import { InputCheckboxOptionGroupComponent } from '../../shared/base/inputs/input-checkbox-option-group/input-checkbox-option-group.component';

@Component({
  selector: 'app-infrastructure-form',
  templateUrl: './infrastructure-form.component.html',
  styleUrls: ['./infrastructure-form.component.scss'],
  standalone: true,
  imports: [
    SharedImports, 
    BaseComponents,
    InputTextComponent,
    SelectComponent,
    InputDateComponent,
    InputPhoneComponent,
    InputCheckboxOptionGroupComponent
  ],
})
export class InfrastructureFormComponent implements OnInit {
  readonly Icons = ConstPath; // Path to icons
  readonly FileUploadComponenetType = FileUploadComponenetType;
  title: string = ''; // Title of the form
  rows: DynamicRow[] = []; // Rows of fields in the form
  dynamicForm!: FormGroup; // FormGroup for reactive forms
  isSubmitted = false; // Tracks if the form is submitted
  dataSubject = new Subject<any>(); // Observable to emit form data
  isSigns: boolean = false;
  selectedFiles: File | null = null;
  base64File: any;
  fileTypes: IdValuePair[] = [];
  filesToUpload: UploadedFile[] = [];
  FileType = FileType;
  isEdit: boolean = false;
  
  // Add the 'of' operator for the select component
  of = of;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InfrastructureFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicRow[];
      title: string;
      isEdit: boolean;
      isSigns: boolean;
    },
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {
    this.rows = data.form; // Initialize rows from injected data
    this.title = data.title;
    this.isSigns = data.isSigns; // Initialize title from injected data
    this.isEdit = data.isEdit;
  }
  optionsApps: CheckboxOption[] = [
    { value: true, label: 'פעיל', checked: true },
  ];
  ngOnInit(): void {
    this.createForm(); // Initialize the form on component load
  }

  /** Closes the dialog */
  onNoClick(): void {
    this.dialog.closeAll();
  }

  /** Creates the reactive form dynamically based on rows and fields */

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
    console.log(this.dynamicForm);
    console.log('File received from child component:', this.selectedFiles);
    if (this.dynamicForm.valid) {
      this.dataSubject.next({
        form: this.dynamicForm.value,
        isEdit: this.data.isEdit,
        uploadedFiles: this.base64File,
      }); // Emit form data if valid
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this.isSubmitted = true; // Mark form as submitted to show validation errors
    }
  }

  getUploadedFile(file: File): void {
    if (!file) {
      console.warn('No file selected');
      return;
    }

    Utils.convertFileToBase64(file)
      .then((base64: string) => {
        // console.log('Base64 String:', base64);
        this.base64File = base64; // Store Base64
      })
      .catch((error) => {
        console.error('Error converting file to Base64:', error);
      });
  }
  toJSON(data: any): string {
    return JSON.stringify(data);
  }
}
