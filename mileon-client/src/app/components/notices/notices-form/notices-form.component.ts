import { Component, Inject, OnInit, OnDestroy, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { ConstPath } from '../../../constants/const_path';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import {
  FileUploadComponenetType,
  FileType,
} from '../../../types/enum/fileType.enum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import { FileUploadNewComponent } from '../../shared/base/upload-files/upload-files.component';
import { ButtonComponent } from '../../shared/base/button/button.component';

@Component({
  selector: 'app-notices-form',
  templateUrl: './notices-form.component.html',
  styleUrls: ['./notices-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FileUploadNewComponent,
    ButtonComponent
  ]
})
export class NoticesFormComponent implements OnInit, OnDestroy {
  readonly Icons = ConstPath; 
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly FileType = FileType;

  private readonly _title = signal<string>('');
  private readonly _rows = signal<DynamicRow[]>([]);
  private readonly _isSubmitted = signal<boolean>(false);
  private readonly _base64File = signal<any>(null);
  private readonly _filesToUpload = signal<UploadedFile[]>([]);
  private readonly _isRequired = signal<boolean>(false);

  readonly title = computed(() => this._title());
  readonly rows = computed(() => this._rows());
  readonly isSubmitted = computed(() => this._isSubmitted());
  readonly base64File = computed(() => this._base64File());
  readonly filesToUpload = computed(() => this._filesToUpload());
  readonly isRequired = computed(() => this._isRequired());

  dynamicForm!: FormGroup;

  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<NoticesFormComponent>);
  private readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      form: DynamicRow[];
      title: string;
      isRequired: boolean;
    }
  ) {
    this._rows.set(data.form);
    this._title.set(data.title);
    this._isRequired.set(data.isRequired);
  }

  ngOnInit(): void {
    this.createForm();
  }

  ngOnDestroy(): void {
    // No subscriptions to clean up
  }

  onNoClick(): void {
    this.dialog.closeAll();
  }

  /** Creates the reactive form dynamically based on rows and fields */
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
    return [field.value ?? '', validations];
  }

  isFieldValid(fieldName: string): boolean {
    return this.dynamicForm.get(fieldName)?.valid || !this.isSubmitted();
  }

  /** Retrieves validations for a specific field */
  private getFieldValidations(field: any): ValidatorFn[] {
    const validations: ValidatorFn[] = [];
    const { validations: fieldValidations } = field;

    if (fieldValidations) {
      if (fieldValidations.required) validations.push(Validators.required);
    }

    return validations;
  }

  /** Handles form submission */
  onSubmit(): void {
    if (this.dynamicForm.valid) {
      // Emit form data through dialog close with result
      this.dialogRef.close({
        form: this.dynamicForm.value,
        uploadedFiles: this.base64File(),
      });
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this._isSubmitted.set(true);
    }
  }

  getUploadedFile(file: File): void {
    if (!file) {
      console.warn('No file selected');
      return;
    }
    Utils.convertFileToBase64(file)
      .then((base64: string) => {
        this._base64File.set(base64);
        this._filesToUpload.set([
          {
            file,
            documentType: 1,
          },
        ]);

        this.dynamicForm.patchValue({ file: base64 });
        this.toaster.success('הקובץ נטען בהצלחה');
      })
      .catch((error) => {
        console.error('Error converting file to Base64:', error);
        this.toaster.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
      });
  }

  getBase64Content(dataUrl: string): string {
    const base64Index = dataUrl.indexOf('base64,');
    return base64Index !== -1 ? dataUrl.substring(base64Index + 7) : dataUrl;
  }
}
