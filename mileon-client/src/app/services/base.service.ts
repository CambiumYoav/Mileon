import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BaseService {
  baseUrl: string;
  mediaUrl: string;
  httpOptions = {};

  constructor() {
    this.baseUrl = environment.apiUrl;
    this.mediaUrl = environment.mediaUrl + '/';
  }

  convertDateTimeToTime(date: Date): string {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let time = ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2);
    return time;
  }

  convertTimeToDateTime(time: string): Date {
    let date = new Date();
    date.setUTCHours(parseInt(time.split(':')[0]));
    date.setUTCMinutes(parseInt(time.split(':')[1]));
    date.setUTCSeconds(0);
    date.setUTCMilliseconds(0);
    return date;
  }

  // To reserve the send date from change and affect by utc conversion.
  setTimeToMidday(currentDate: Date | undefined) {
    currentDate?.setHours(12, 0, 0, 0);
  }
}
