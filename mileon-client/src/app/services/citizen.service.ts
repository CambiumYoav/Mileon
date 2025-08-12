import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { Observable } from 'rxjs';
import { Citizen } from '../types/citizen';
import { CitizenPhone } from '../types/citizenPhones';
import { BaseService } from './base.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class CitizenService {
  configUrl: string;
  api: string;
  private baseService = inject(BaseService);
  private http = inject(HttpClient);
  private httpService = inject(HttpService);
  constructor() {
    this.configUrl = this.baseService.baseUrl + '/Citizen';
    this.api = 'Citizen';
  }

  updateCitizen(citizen: Citizen): Observable<Citizen> {
    this.removeUnused(citizen);
    return this.http.post<Citizen>(
      this.configUrl,
      citizen,
      this.baseService.httpOptions
    );
  }

  removeUnused(citizen: Citizen) {
    if (citizen.citizenPhones) {
      for (let index = 0; index < citizen.citizenPhones.length; index++) {
        const element = citizen.citizenPhones[index];
        if (!element.phone) {
          citizen.citizenPhones.splice(index, 1);
          index--;
        }
      }
    }
  }

  getCitizenByID(id: string) {
    const res = this.httpService.getRequest<Citizen>(this.api + '/' + id);
    return lastValueFrom(res);
  }

  buildPhonesObjects(citizen: Citizen) {
    if (!citizen) {
      console.error('Citizen is null or undefined');
      return;
    }

    if (!citizen.citizenPhones) {
      citizen.citizenPhones = new Array<CitizenPhone>();
    }

    let result: { phone: any; anotherPhone: any } = {
      phone: null,
      anotherPhone: null,
    };

    let phone = citizen.citizenPhones?.find((x) => x.isMain);
    if (!phone) {
      phone = new CitizenPhone();
      phone.isMain = undefined;
      phone.phone = '';
      citizen.citizenPhones.push(phone);
    }
    result.phone = phone;

    let anotherPhone = citizen.citizenPhones?.find((x) => !x.isMain);
    if (!anotherPhone) {
      anotherPhone = new CitizenPhone();
      anotherPhone.isMain = undefined;
      anotherPhone.phone = '';
      citizen.citizenPhones.push(anotherPhone);
    }
    result.anotherPhone = anotherPhone;

    return result;
  }
}
