import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ParkingPermitDetails } from '../types/parkingPermit/parkingPermitDetails';
import { BaseService } from './base.service';
import { ErrorSuccessMessages } from '../types/enum/error-success-messages';
import { HttpService } from './http.service';
import { ParkingPermit } from '../types/parkingPermit/parkingPermit';

@Injectable({
  providedIn: 'root',
})
export class ParkingPermitService {
  configUrl: string;
  private baseService = inject(BaseService);
  private http = inject(HttpClient);
  private httpService = inject(HttpService);
  constructor() {
    this.configUrl = this.baseService.baseUrl + '/ParkingPermit';
  }

  getParkingPermitById(id: string): Observable<ParkingPermitDetails> {
    const url = `${this.configUrl}/${id}`;
    return this.http
      .get<ParkingPermitDetails>(url, this.baseService.httpOptions)
      .pipe(
        catchError(this.httpService.handleError) // Only catchError without displaying a success toast
      );
  }

  updateParkingPermit(
    parkingPermit: ParkingPermit
  ): Observable<ParkingPermitDetails> {
    const url = `${this.configUrl}/CreateOrUpdate`;
    return this.http
      .post<ParkingPermitDetails>(
        url,
        parkingPermit,
        this.baseService.httpOptions
      )
      .pipe(
        tap(() =>
          this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)
        ),
        catchError(this.httpService.handleError)
      );
  }
}
