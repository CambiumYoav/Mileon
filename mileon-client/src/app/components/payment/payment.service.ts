import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { ModuleEnum } from '../../types/enum/moduleEnum';
import { ParkingPermit } from '../../types/parkingPermit/parkingPermit';
import { Check } from '../../types/payments/check';
import { PaymentForm } from '../../types/payments/payment-form';
import { TicketNew } from '../../types/ticket';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  apiController = 'Payments';
  private httpService = inject(HttpService);
  constructor() {}

  getPaymentIframe(
    recordIds: string[],
    total: number,
    cardId: string = '',
    module: ModuleEnum
  ): Promise<any> {
    const res = this.httpService.getRequest(`${this.apiController}/iframe`, {
      recordsIds: recordIds,
      total: total,
      module: module,
      cardId: cardId,
    });
    return lastValueFrom(res);
  }

  savePayments(body: PaymentForm): Promise<TicketNew[] | ParkingPermit[]> {
    const res = this.httpService.postRequest<TicketNew[] | ParkingPermit[]>(
      `${this.apiController}/save`,
      body,
      ErrorSuccessMessages.PAYMENT_SUCCESS
    );
    return lastValueFrom(res);
  }

  checkLimitedAccount(checks: Check[]) {
    const res = this.httpService.postRequest<boolean>(
      `${this.apiController}/LimitedAccount/`,
      checks
    );
    return lastValueFrom(res);
  }
}
