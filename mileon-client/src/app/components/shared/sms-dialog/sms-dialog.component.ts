import {
  Component,
  Inject,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GeneralButtons } from '../../../constants/buttonEnum';
import { ConstPath } from '../../../constants/const_path';
import { FieldTypeEnum } from '../../../types/advanced-search/form-tab.model';
import { SendEmailDialogEnum } from '../../../types/dialog/sendSmsDialogEnum';
import { ModuleEnum } from '../../../types/enum/moduleEnum';
import { ActionButtonsComponent } from '../action-buttons/action-buttons.component';
import { SmsDialogService } from './sms-dialog.service';
import { SmsDialogType } from '../../../types/dialogs/sms-dialog';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { InputTextComponent } from '../base/inputs/input-text/input-text.component';
import { InputCheckboxComponent } from '../base/inputs/input-checkbox/input-checkbox.component';
import { ButtonComponent } from '../base/button/button.component';
import { SharedImports } from '../../../shared/shared-modules';
import { InputPhoneComponent } from '../base/inputs/input-phone/input-phone.component';
import { TextareaCommentsComponent } from '../base/inputs/textarea-comments/textarea-comments.component';

@Component({
  selector: 'app-sms-dialog',
  templateUrl: './sms-dialog.component.html',
  styleUrl: './sms-dialog.component.scss',
  imports: [

    InputCheckboxComponent,
    TextareaCommentsComponent,
    ButtonComponent,
    InputPhoneComponent,
    SharedImports,
  ],
})
export class SmsDialogComponent implements OnInit {
  // Inject services and data
  public dialogRef = inject(MatDialogRef<ActionButtonsComponent>);
  private sendSmsDialogService = inject(SmsDialogService);

  // Inject MAT_DIALOG_DATA
  public data = inject<SmsDialogType>(MAT_DIALOG_DATA);

  // Constants
  readonly sendSmsFields = SendEmailDialogEnum;
  readonly buttonEnum = GeneralButtons;
  readonly Icons = ConstPath;
  readonly FieldTypeEnum = FieldTypeEnum;
  readonly errorMessage: string = ErrorSuccessMessages.SMS_PHONE_INVALID;

  // Form reference
  sendSmsForm!: FormGroup;

  // Signals for reactive state
  isFormValid = signal<boolean>(false);

  // Computed signal for button state
 

  constructor() {
    this.sendSmsForm = this.sendSmsDialogService.form;

    // Track form validity changes
    this.sendSmsForm.statusChanges.subscribe(() => {
      this.isFormValid.set(this.sendSmsForm.valid);
    });
  }

  ngOnInit(): void {
    this.sendSmsForm.controls['phoneNumber'].patchValue(
      this.data.phoneNumber || ''
    );
    // Update: Don't reset after patching, or patch after reset
    // this.sendSmsForm.reset(); // This will clear the phone number you just set

    // Initial validity check
    this.isFormValid.set(this.sendSmsForm.valid);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  closeDialogWithResult(dialogResult: any): void {
    this.dialogRef.close(dialogResult);
  }

  onSendSmsAction(): void {
    if (this.sendSmsForm.valid) {
      const sendSmsBody = {
        recordId: this.data.recordId,
        moduleEnum: this.data.moduleEnum,
        phoneNumber: this.sendSmsForm.controls['phoneNumber'].value,
        updateCitizenPhoneNumber:
          !!this.sendSmsForm.controls['updateCitizenPhoneNumber'].value,
        comments: this.sendSmsForm.controls['comments'].value,
      };

      this.sendSmsDialogService.sendSmsAction(sendSmsBody);

      this.closeDialogWithResult({
        actionName: 'SendSms',
        isSuccess: true,
        data: sendSmsBody,
      });
    }
  }

  // Helper method to check field validity
  isFieldInvalid(fieldName: string): boolean {
    const field = this.sendSmsForm.get(fieldName);
    return !!(field?.touched && field?.invalid);
  }
}
