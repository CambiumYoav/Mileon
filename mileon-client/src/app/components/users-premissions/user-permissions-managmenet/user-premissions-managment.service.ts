import { inject, Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../services/http.service';  
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root',
})
export class UserPremissionsManagmentService {
  apiController = 'Area';

  private httpService = inject(HttpService);
  private usersService = inject(UsersService);

  getAreaUsers(searchText: string) {
    const res = this.httpService.getRequest(
      `${this.apiController}/users?searchText=${searchText}`
    );
    return lastValueFrom(res);
  }

  updateArea(areaId: string, body: any = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/update/${areaId}`,
      body
    );
    return lastValueFrom(res);
  }

  getAreas(filters?: any) {
    const search = filters?.searchText
      ? `&SearchText=${filters.searchText}`
      : '';

    const currentPage = filters?.currentPage
      ? `&CurrentPage=${filters.currentPage}`
      : '';
    
    const pageSize = filters?.pageSize
      ? `&PageCount=${filters.pageSize}`
      : '&PageCount=100';
    
    const authorityId = filters?.authorityId
      ? `&AuthorityId=${filters.authorityId}`
      : '';
    
    const url = `${this.apiController}/search?PageSize=${filters?.pageSize || 100}&PageCount=${filters?.pageSize || 100}${currentPage}${search}${authorityId}`;
    
    const res = this.httpService.getRequest(url);
    return lastValueFrom(res);
  }

  getAreasLookup(authorityId: string) {
    const res = this.httpService.getRequest(
      `${this.apiController}/lookup/areas?authorityID=${authorityId}`
    );
    return lastValueFrom(res);
  }

  getUsers(filters?: any) {
    const search = filters?.searchText
      ? `?SearchText=${filters.searchText}`
      : `?SearchText=''`;

    const res = this.httpService.getRequest(
      `${this.apiController}/users${search}`
    );
    return lastValueFrom(res);
  }

  addUserToArea(areaId: string, body: any = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/add/${areaId}`,
      body
    );

    return lastValueFrom(res);
  }

  removeUserFromArea(areaId: string, body: any = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/remove/${areaId}`,
      body
    );

    return lastValueFrom(res);
  }

  getAllUsers(authorityId: string, filter?: any) {
    return this.usersService.getUsersLocal(authorityId, filter);
  }

  getUsersByArea(areaId: string, searchText?: string, authorityId?: string) {
    const search = searchText ? `?searchText=${searchText}` : '';
    const res = this.httpService.getRequest(
      `${this.apiController}/users/${areaId}${search}?AuthorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }
}
