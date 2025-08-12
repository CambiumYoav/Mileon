import {
  HttpClient,
  HttpResponse,
  HttpHeaders,
  HttpEventType,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorSuccessMessages } from '../types/enum/error-success-messages';
import { ErrorResponse } from '../types/errorResponse';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  toastr = inject(ToastrService);

  public getRequest<T>(type: string, params?: any): Observable<T | any> {
    const options: { headers: HttpHeaders; params?: HttpParams } = {
      headers: this.buildHeaders(),
    };
    if (params) {
      options.params = params;
    }
    return this.httpClient
      .get<T>(`${this.apiUrl}/${type}`, options)
      .pipe(catchError(this.handleError.bind(this)));
  }

  public getRequestWithParams<T>(type: string, params?: any): Observable<any> {
    const options: { headers: HttpHeaders; params?: HttpParams } = {
      headers: this.buildHeaders(),
    };
    if (params) {
      options.params = params;
    }
    const urlParams = this.buildParams(params);

    return this.httpClient
      .get<T>(`${this.apiUrl}/${type}`, options)
      .pipe(catchError(this.handleError.bind(this)));
  }

  getRequestWithQueryParams<T>(type: string, params: any): Observable<T | any> {
    const options = {
      headers: this.buildHeaders(),
    };

    const queryParams = this.buildQueryParams(params);

    return this.httpClient
      .get<T>(`${this.apiUrl}/${type}?${queryParams}`, options)
      .pipe(catchError(this.handleError.bind(this)));
  }

  postRequest<T>(
    type: string,
    body: Object,
    successMessage?: string
  ): Observable<T | any | ErrorResponse> {
    return this.httpClient
      .post<T>(`${this.apiUrl}/${type}`, body, {
        headers: this.buildHeaders(),
      })
      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }

  postRequestForBlob(
    type: string,
    body: Object,
    successMessage?: string
  ): Observable<Blob> {
    return this.httpClient
      .post(`${this.apiUrl}/${type}`, body, {
        headers: this.buildHeadersForFile(),
        responseType: 'blob',
      })

      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }
  postRequestForBlobAsResponse(
    type: string,
    body: Object,
    successMessage?: string
  ): Observable<HttpResponse<Blob>> {
    return this.httpClient
      .post(`${this.apiUrl}/${type}`, body, {
        headers: this.buildHeadersForFile(),
        responseType: 'blob',
        observe: 'response', // This allows you to get both headers and body
      })
      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }

  postRequestWithHeaders<T>(
    type: string,
    body: Object,
    requestType: string,
    successMessage?: string
  ): Observable<T | any> {
    // Create headers object
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*', // Set as needed
      requestType: requestType, // Example of using requestType as a custom header
    });

    return this.httpClient
      .post<T>(`${this.apiUrl}/${type}`, body, { headers })
      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }

  postRequestWithMultipartHeaders<T>(
    type: string,
    body: FormData,
    successMessage?: string
  ): Observable<T | any> {
    // Create headers object
    const headers = new HttpHeaders({
      requestType: 'application/json',
    });

    return this.httpClient
      .post<T>(`${this.apiUrl}/${type}`, body, { headers })
      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }

  protected buildHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();

    if (!isFormData) {
      headers = headers.append('Content-Type', 'application/json');
    }
    return headers;
  }
  private buildHeadersForFile(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
    });
  }
  public deleteRequest<T>(
    type: string,
    params?: any,
    successMessage?: string
  ): Observable<T | any> {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    const options = {
      headers: this.buildHeaders(),
      params: httpParams,
    };

    return this.httpClient.delete<T>(`${this.apiUrl}/${type}`, options).pipe(
      tap(() => {
        if (successMessage) {
          this.toastr.success(successMessage);
        }
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private buildQueryParams(params: { [key: string]: any }): string {
    let queryParams = '';
    if (params)
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          if (queryParams !== '') {
            queryParams += '&';
          }
          if (Array.isArray(params[key])) {
            const arrayParams = params[key] as Array<any>;
            arrayParams.forEach((value) => {
              queryParams += `${encodeURIComponent(key)}=${encodeURIComponent(
                value
              )}&`;
            });
          } else {
            queryParams += `${encodeURIComponent(key)}=${encodeURIComponent(
              params[key]
            )}`;
          }
        }
      });
    return queryParams;
  }

  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        const value = params[key];
        if (Array.isArray(value)) {
          // Handle array values
          value.forEach((item) => {
            httpParams = httpParams.append(key, item);
          });
        } else {
          // Handle single values
          httpParams = httpParams.set(key, value);
        }
      }
    }

    return httpParams;
  }

  public handleError = (response: HttpErrorResponse) => {
    let errorMessage = ErrorSuccessMessages.DEFAULT;
    if (!navigator.onLine) {
      this.toastr.error(ErrorSuccessMessages.SOMETHING_WENT_WRONG_TRY_LATER);
    } else {
      if (response && response.status) {
        switch (response.status) {
          case 503:
            errorMessage = ErrorSuccessMessages.NO_COMMUNICATION;
            break;
          case 400:
            errorMessage = ErrorSuccessMessages.INVALID_DETAILS;
            break;
          case 422:
            errorMessage = ErrorSuccessMessages.INVALID_DETAILS;
            break;
          case 403:
            errorMessage = ErrorSuccessMessages.LIMITED_ACCOUNT;
            break;

          case 401:
            const rawMessage = response.error;
            errorMessage = this.translateServerMessageToHebrew(rawMessage);
            break;

          default:
            errorMessage = ErrorSuccessMessages.DEFAULT;
            break;
        }
        this.toastr.error(errorMessage);
      }
    }

    let error = {
      status: response?.status,
      code: response?.error?.code,
      message: response?.message || '',
    };

    return throwError(() => new Error(error.message));
  };

  private translateServerMessageToHebrew(
    message: string
  ): ErrorSuccessMessages {
    switch (message) {
      case 'Password expired':
        return ErrorSuccessMessages.PASSWORD_EXPIRED;
      default:
        return ErrorSuccessMessages.INVALID_DETAILS_TRY_AGAIN;
    }
  }

  getRequestForBlob(
    type: string,
    params?: any,
    successMessage?: string
  ): Observable<Blob> {
    const options = {
      headers: this.buildHeadersForFile(),
      responseType: 'blob' as 'json', // Ensures the response is treated as a Blob
      params: params || {},
    };

    return this.httpClient.get<Blob>(`${this.apiUrl}/${type}`, options).pipe(
      tap(() => {
        if (successMessage) {
          this.toastr.success(successMessage); // Display success message if provided
        }
      }),
      catchError(this.handleError) // Handle errors appropriately
    );
  }

  //REVIEW - Remove this!
  public getRequestForPdfCheck<T>(
    type: string,
    params?: any
  ): Observable<T | any> {
    const options: { headers: HttpHeaders; params?: HttpParams } = {
      headers: this.buildHeaders(),
    };
    if (params) {
      options.params = params;
    }
    return this.httpClient
      .get<T>(`https://localhost:7092/api/${type}`, options)
      .pipe(catchError(this.handleError.bind(this)));
  }

  postRequestForBlobAsResponseForPdfCheck(
    type: string,
    body: Object,
    successMessage?: string
  ): Observable<HttpResponse<Blob>> {
    return this.httpClient
      .post(`https://localhost:7092/api/${type}`, body, {
        headers: this.buildHeadersForFile(),
        responseType: 'blob',
        observe: 'response', // This allows you to get both headers and body
      })
      .pipe(
        tap(() => {
          if (successMessage) {
            this.toastr.success(successMessage);
          }
        }),
        catchError(this.handleError)
      );
  }
}
