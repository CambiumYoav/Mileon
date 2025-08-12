// import { ConstPath } from './../../../../oldCode/src/app/constants/const_path';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject, lastValueFrom } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Note } from '../types/note';
import { UpdateNoteParameters } from '../types/updateNoteParameters';
import { UserActivityData } from '../types/userActivityData';
import { BaseService } from './base.service';
import { ErrorSuccessMessages } from '../types/enum/error-success-messages';
import { HttpService } from './http.service';
import { SummaryTotal } from '../types/summary.model';
import { PermissionService } from './permission.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  configUrl: string;
  apiController: string = 'User';
  private baseService = inject(BaseService);
  private http = inject(HttpClient);
  private httpService = inject(HttpService);
  private permissionService = inject(PermissionService);
  constructor() {
    this.configUrl = this.baseService.baseUrl + '/User';
  }

  userActivityData: UserActivityData = new UserActivityData();
  userActivityDataSubject: ReplaySubject<UserActivityData> =
    new ReplaySubject<UserActivityData>();
  userActivityDataSubject$: Observable<UserActivityData> =
    this.userActivityDataSubject.asObservable();

  getUserNotes(ticketID?: string): Observable<Note[]> {
    let url = this.configUrl + '/Notes';
    if (ticketID) {
      url += '?ticketID=' + ticketID;
    }

    return this.http.get<Note[]>(url, this.baseService.httpOptions);
  }

  updateNote(updateNoteParameters: UpdateNoteParameters): Observable<Note> {
    return this.http
      .post<Note>(
        this.configUrl + '/UpdateNote',
        updateNoteParameters,
        this.baseService.httpOptions
      )
      .pipe(
        tap(() =>
          this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)
        ),
        catchError(this.httpService.handleError)
      );
  }

  deleteNote(noteID: string): Observable<any> {
    let url = this.configUrl + '/Note?noteID=' + noteID;
    return this.http.delete(url, this.baseService.httpOptions).pipe(
      tap(() =>
        this.httpService.toastr.success(
          ErrorSuccessMessages.DELETE_SUCCESSFULLY
        )
      ),
      catchError(this.httpService.handleError)
    );
  }

  createNote(note: Note): Observable<Note> {
    return this.http
      .post<Note>(this.configUrl + '/Note', note, this.baseService.httpOptions)
      .pipe(
        tap(() =>
          this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)
        ),
        catchError(this.httpService.handleError)
      );
  }

  dragNotes(noteIDs: string[]): Observable<Note> {
    return this.http
      .post<Note>(
        this.configUrl + '/DragNotes',
        noteIDs,
        this.baseService.httpOptions
      )
      .pipe(
        tap(() =>
          this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)
        ),
        catchError(this.httpService.handleError)
      );
  }

  sendNoteToSupervisor(noteID: string): Observable<Note> {
    let url = this.configUrl + '/SendNoteToSupervisor?noteID=' + noteID;
    return this.http.post<Note>(url, this.baseService.httpOptions).pipe(
      tap(() => this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)),
      catchError(this.httpService.handleError)
    );
  }

  updateNoteComment(
    noteID: string,
    supervisorComment?: string
  ): Observable<Note> {
    let url = this.configUrl + '/UpdateNoteComment?noteID=' + noteID;
    if (supervisorComment) {
      url += '&supervisorComment=' + supervisorComment;
    }
    return this.http.post<Note>(url, this.baseService.httpOptions).pipe(
      tap(() => this.httpService.toastr.success(ErrorSuccessMessages.SUCCESS)),
      catchError(this.httpService.handleError)
    );
  }

  getUserActivityData(): Observable<UserActivityData> {
    this.getUserActivityDataRequest().subscribe({
      next: (res) => {
        this.userActivityData = res;
        this.userActivityDataSubject.next(this.userActivityData);
      },

      error: (err) => {},
    });
    return this.userActivityDataSubject$;
  }

  getUserActivityDataRequest(): Observable<UserActivityData> {
    return this.http.get<UserActivityData>(
      this.configUrl + '/ActivityData',
      this.baseService.httpOptions
    );
  }

  getMainSummaryTotal(authorityId: string): Promise<SummaryTotal> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/SummaryTotal`
    );
    return lastValueFrom(res);
  }

  getUserNameFromToken() {
    return this.permissionService.userName();
  }

  getUserEmailFromToken() {
    return this.permissionService.email();
  }
}
