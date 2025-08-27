import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthorityService } from '../../services/authority.service ';
import { HttpService } from '../../services/http.service';
import { PermissionService } from '../../services/permission.service';
import { TimelineStepsType } from '../../types/enum/timelineSettings.enum';
import {
  SettingsFieldUpdate,
  UpdatedStepData,
} from '../../types/timeline-settings/timeline-settings-types';

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  apiController = 'Enforcement';

  constructor(
    private httpService: HttpService,
    private authorityService: AuthorityService
  ) {}

  getTimelineSettings() {
    try {
      const authority: string = this.authorityService.getAuthorityID();
      const url = `${this.apiController}?AuthorityId=${authority}`;
      const res = this.httpService.getRequest(url);
      return lastValueFrom(res);
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
  updateEnforcementSettings(updatedFields: SettingsFieldUpdate[]) {
    try {
      const url = `${this.apiController}/update`;
      const res = this.httpService.postRequest(url, updatedFields);
      return lastValueFrom(res);
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  getTimelineSteps(type: TimelineStepsType) {
    try {
      const authority: string = this.authorityService.getAuthorityID();
      const url = `${this.apiController}/order/${type}?AuthorityId=${authority}`;
      const res = this.httpService.getRequest(url);
      return lastValueFrom(res);
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }

  updateStepOrder(type: TimelineStepsType, updatedStep: UpdatedStepData) {
    try {
      const url = `${this.apiController}/order/${type}`;
      const res = this.httpService.postRequest(url, updatedStep);
      return lastValueFrom(res);
    } catch (error: any) {
      console.error(error);
      return error;
    }
  }
}
