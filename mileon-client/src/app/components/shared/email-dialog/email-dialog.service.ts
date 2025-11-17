import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { SendEmailDialogForm } from '../../../types/dialog/sendEmailDialogOptions';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';
import { BaseFormService } from '../base-form/base-form.service';

@Injectable({
  providedIn: 'root',
})
export class EmailDialogService {
  form: FormGroup;

  apiController = 'Actions';

  constructor(
    private baseFormService: BaseFormService,
    private httpService: HttpService
  ) {
    this.form = this.baseFormService.createFormGroup(SendEmailDialogForm);
  }

  sendEmailAction(body = {}): Promise<any> | null {
    const res = this.httpService.postRequest(
      `${this.apiController}/email`,
      body,
      ErrorSuccessMessages.SENT_SUCCESSFULLY
    );
    return lastValueFrom(res);
  }
}
