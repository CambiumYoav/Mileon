import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralButtons } from '../../../constants/buttonEnum';
import { ConstPath } from '../../../constants/const_path';
import { SharedImports } from '../../../shared/shared-modules';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { ButtonComponent } from '../base/button/button.component';
import { InputCheckboxComponent } from '../base/inputs/input-checkbox/input-checkbox.component';
import { TextareaCommentsComponent } from '../base/inputs/textarea-comments/textarea-comments.component';
import { EmailDialogType } from '../../../types/dialogs/email-dialog';
import { EmailDialogService } from './email-dialog.service';
import { MyRef } from '../../../types/myRef';
import {
  ActionDialog,
  SendEmailDialogFields,
} from '../../../types/dialog/sendEmailDialogOptions';
import { ToggleCheckboxGroupComponent } from '../toggle-checkbox-group/toggle-checkbox-group.component';
import { InputTextComponent } from '../base/inputs/input-text/input-text.component';

@Component({
  selector: 'app-email-dialog',
  imports: [
    InputCheckboxComponent,
    TextareaCommentsComponent,
    ButtonComponent,
    ToggleCheckboxGroupComponent,
    SharedImports,
    InputTextComponent,
  ],
  templateUrl: './email-dialog.component.html',
  styleUrl: './email-dialog.component.scss',
})
export class EmailDialogComponent implements OnInit {
  public dialogRef = inject(MatDialogRef<ActionButtonsComponent>);
  public data = inject<EmailDialogType>(MAT_DIALOG_DATA);
  private sendEmailDialogService = inject(EmailDialogService);

  // Constants
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly Icons = ConstPath;
  readonly errorMessage: string = ErrorSuccessMessages.EMAIL_INVALID;
  readonly buttonEnum = GeneralButtons;
  // Form reference
  sendEmailForm: FormGroup = this.sendEmailDialogService.form;
  sendEmailFields: ActionDialog;

  // Non-signal properties (keep MyRef as is for compatibility)
  isAllDocsChecked: MyRef<boolean> = { current: false };

  // Signals for reactive state
  isFormValid = signal<boolean>(false);
  emailAddress = signal<string>('');

  // Computed signal for submit button
  canSubmit = computed(() => this.isFormValid() && !!this.emailAddress());

  submitButtonClass = computed(() =>
    this.canSubmit() ? 'primary-btn-fill' : 'primary-btn-disabled'
  );

  constructor() {
    // Initialize fields based on module
    this.sendEmailFields = SendEmailDialogFields.getSendEmailDialogFields(
      this.data.moduleEnum
    );

    // Track form validity changes
    this.sendEmailForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.sendEmailForm.valid);
      this.emailAddress.set(
        this.sendEmailForm.controls['emailAddress']?.value || ''
      );
    });
  }

  ngOnInit(): void {
    // Patch email address from data
    this.sendEmailForm.controls['emailAddress'].patchValue(
      this.data.emailAddress || ''
    );

    // Initialize signals
    this.isFormValid.set(this.sendEmailForm.valid);
    this.emailAddress.set(
      this.sendEmailForm.controls['emailAddress']?.value || ''
    );

    // Note: Removed reset() as it would clear the patched email
    // If you need to reset other fields, do it selectively
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialogWithResult(dialogResult: any): void {
    this.dialogRef.close(dialogResult);
  }

  onSendEmailAction(): void {
    if (this.canSubmit()) {
      const sendEmailBody = {
        ...this.data,
        ...this.sendEmailForm.value,
      };

      this.sendEmailDialogService.sendEmailAction(sendEmailBody);

      this.closeDialogWithResult({
        actionName: 'SendEmail',
        isSuccess: true,
        data: sendEmailBody,
      });
    }
    // TODO: handle and show email action status (success? failed?)
  }

  // Helper method to check field validity
  isFieldInvalid(fieldName: string): boolean {
    const field = this.sendEmailForm.get(fieldName);
    return !!(field?.touched && field?.invalid);
  }

  // Helper to get field value
  getFieldValue(fieldName: string): any {
    return this.sendEmailForm.get(fieldName)?.value;
  }
}
