import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { ErrorSuccessMessages } from '../../../types/enum/error-success-messages';

@Injectable({
  providedIn: 'root',
})
export class SmsDialogService {
  form: FormGroup;
  apiController = 'Actions';

  constructor(private httpService: HttpService, private fb: FormBuilder) {
    this.form = this.fb.group({
      phoneNumber: this.fb.control(null, [
        Validators.required,
        Validators.pattern('(\\+972|0)?5[0-9]{8}'),
      ]),
      updateCitizenPhoneNumber: this.fb.control(false),
      comments: this.fb.control(null),
    });
  }

  sendSmsAction(body = {}): Promise<any> | null {
    const res = this.httpService.postRequest(
      `${this.apiController}/sms`,
      body,
      ErrorSuccessMessages.SENT_SUCCESSFULLY
    );
    return lastValueFrom(res);
  }
}
