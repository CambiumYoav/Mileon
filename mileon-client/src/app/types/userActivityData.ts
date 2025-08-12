import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserActivityData {
  userName: string = '';
  callSummaryCount: number = 0;
  userPaymentCount: number = 0;
}
