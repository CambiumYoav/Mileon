import { Component, Inject, OnInit, signal, computed, inject } from '@angular/core';
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
import {
  FileUploadComponenetType,
  FileType,
} from '../../../types/enum/fileType.enum';
import { DynamicRow } from '../../../types/infrastructure/InfrastructureTypes';
import { UploadedFile } from '../../../types/uploadedFile';
import { Utils } from '../../../utils/utils';
import {
  DraftLettersValues,
  Template,
} from '../../../types/templates/template.type';
import { ModalMessages } from '../../../constants/modalMessages';
import { CkEditorConfig } from '../../../types/ck-editor/ck-editor-config';
import { DraftsAndLettersTypes } from '../../../types/enum/draftAndLetters.enum';
import { RouterService } from '../../../services/router.service';
import { ROUTE_PATH as RP } from '../../../constants/routerPath';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/base/button/button.component';
import { CkEditorWrapperComponent } from '../../shared/ck-editor-wrapper/ck-editor-wrapper.component';
import { FileUploadNewComponent } from '../../shared/base/upload-files/upload-files.component';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { InputTextComponent } from '../../shared/base/inputs/input-text/input-text.component';
@Component({
  selector: 'app-authority-management-templates-form',
  templateUrl: './authority-management-templates-form.component.html',
  styleUrls: ['./authority-management-templates-form.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    CkEditorWrapperComponent,
    FileUploadNewComponent,
    ConfirmationModalComponent,
    InputTextComponent,
  ],
})
export class AuthorityManagementTemplatesFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly dialogRef = inject(MatDialogRef<AuthorityManagementTemplatesFormComponent>);
  public readonly data = inject(MAT_DIALOG_DATA) as {
    form: DynamicRow[];
    title: string;
    isEdit: boolean;
    isRequired: boolean;
    template?: Template;
  };
  private readonly dialog = inject(MatDialog);
  private readonly toaster = inject(ToastrService);
  private readonly routerService = inject(RouterService);

  readonly Icons = ConstPath;
  readonly FileUploadComponenetType = FileUploadComponenetType;
  readonly ModalMessages = ModalMessages;
  readonly FileType = FileType;

  private readonly isSubmittedSignal = signal<boolean>(false);
  private readonly isDeleteSignal = signal<boolean>(false);
  private readonly isSaveModalOpenSignal = signal<boolean>(false);
  private readonly isDeleteModalOpenSignal = signal<boolean>(false);

  readonly isSubmitted = computed(() => this.isSubmittedSignal());
  readonly isDelete = computed(() => this.isDeleteSignal());
  readonly isSaveModalOpen = computed(() => this.isSaveModalOpenSignal());
  readonly isDeleteModalOpen = computed(() => this.isDeleteModalOpenSignal());

  title: string = '';
  rows: DynamicRow[] = [];
  dynamicForm!: FormGroup;
  base64File: any;
  filesToUpload: UploadedFile[] = [];
  isEdit: boolean = false;
  isRequired: boolean = false;
  template?: Template;
  config = new CkEditorConfig().templateTextConfig;
  editorData: any;
  draftLettersValues: DraftLettersValues[] | null = null;

  ngOnInit(): void {
    this.rows = this.data.form;
    this.title = this.data.title;
    this.isEdit = this.data.isEdit;
    this.isRequired = this.data.isRequired;
    this.template = this.data.template;

    console.log(this.isRequired);
    this.createForm();
    if (this.template && this.template.templateID != '') {
      this.dynamicForm.patchValue({
        templateID: this.template.templateID,
        templateTitle: this.template.templateTitle,
        templateBody: this.template.templateBody,
      });
      if (this.template.templateBody?.startsWith('data:')) {
        const file = Utils.base64ToFileAuto(this.template.templateBody);
        this.filesToUpload = [{ file, documentType: 1 }];
        const base64 = this.getBase64Content(this.template.templateBody); // <– only iVBORw0...
        this.dynamicForm.patchValue({ templateBody: base64 });
        this.editorData = this.template.templateBody;
      }

      this.editorData = this.template.templateBody;
      this.draftLettersValues =
        this.template.isInUse && this.template.draftLettersValues
          ? this.template.draftLettersValues
          : null;
    }
  }

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

    return [field.value ?? '', validations];
  }

  isFieldValid(fieldName: string): boolean {
    return this.dynamicForm.get(fieldName)?.valid || !this.isSubmitted();
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.dynamicForm.get(fieldName);
    if (!control || !control.errors || !this.isSubmitted()) {
      return '';
    }

    const errors = control.errors;
    if (errors['required']) {
      return 'שדה זה נדרש';
    }
    if (errors['maxlength']) {
      return `אורך מקסימלי: ${errors['maxlength'].requiredLength} תווים`;
    }
    if (errors['minlength']) {
      return `אורך מינימלי: ${errors['minlength'].requiredLength} תווים`;
    }
    if (errors['pattern']) {
      return 'פורמט לא תקין';
    }
    if (errors['min']) {
      return `ערך מינימלי: ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `ערך מקסימלי: ${errors['max'].max}`;
    }

    return 'ערך לא תקין';
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
      // Emit form data using dialogRef instead of Subject
      this.dialogRef.close({
        form: this.dynamicForm.value,
        isEdit: this.data.isEdit,
        uploadedFiles: this.base64File,
        template: this.template ?? null,
        isDelete: this.isDelete(),
      });
    } else {
      this.toaster.error(ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN);
      console.error('Form is invalid', this.dynamicForm);
      this.isSubmittedSignal.set(true); // Mark form as submitted to show validation errors
    }
  }

  onDelete() {
    this.isDeleteSignal.set(true); // Set the delete flag to true
    this.onSubmit(); // Call onSubmit to emit the form data with isDelete flag
  }

  openDeleteModal() {
    this.isDeleteModalOpenSignal.set(true);
  }

  openSaveModal() {
    this.isSaveModalOpenSignal.set(true); // Open the modal for confirmation
  }

  closeModal() {
    this.isSaveModalOpenSignal.set(false); // Close the modal
    this.isDeleteModalOpenSignal.set(false);
  }
  getUploadedFile(file: File): void {
    if (!file) {
      console.warn('No file selected');
      return;
    }
    Utils.convertFileToBase64(file)
      .then((base64: string) => {
        this.base64File = base64; // Store Base64
        this.filesToUpload = [
          {
            file,
            documentType: 1,
          },
        ];

        this.dynamicForm.patchValue({ templateBody: this.base64File }); // Update form control with Base64
      })
      .catch((error) => {
        console.error('Error converting file to Base64:', error);
      });
  }

  emitChangedData(data: any) {
    this.editorData = data;
    this.dynamicForm.patchValue({ templateBody: this.editorData });
  }

  onLinkClick(id: string, name: string, type: DraftsAndLettersTypes) {
    if (type == DraftsAndLettersTypes.Draft)
      this.navigateToUpdateDraft(id, name);
    else if (type == DraftsAndLettersTypes.Letter)
      this.navigateToUpdateLetter(id, name);
  }

  navigateToUpdateDraft(id: string, name: string) {
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateDraft}/${id}/${name}`
    );
    this.dialog.closeAll();
  }

  navigateToUpdateLetter(id: string, name: string) {
    const baseRoute = RP.Management.Home;
    this.routerService.navigateToPageURL(
      `${baseRoute}/${RP.Management.DraftsAndLetters}/${RP.Management.UpdateLetter}/${id}/${name}`
    );
    this.dialog.closeAll();
  }

  getBase64Content(dataUrl: string): string {
    const base64Index = dataUrl.indexOf('base64,');
    return base64Index !== -1 ? dataUrl.substring(base64Index + 7) : dataUrl;
  }
}
