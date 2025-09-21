import { Injectable, inject } from '@angular/core';
// import { filterSquare } from 'ngx-bootstrap-icons';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../../services/http.service';
import { LookupNewService } from '../../../services/lookup-new.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly apiController = 'User';
  private readonly httpService = inject(HttpService);
  private readonly lookupNewService = inject(LookupNewService);

  async getUsersLocal(authorityId: string, filters?: {
    searchText?: string;
    isActive?: boolean;
    currentPage?: number;
  }): Promise<any> {
    const search = filters?.searchText
      ? `&SearchText=${filters.searchText}`
      : '';

    const isActive =
      filters && filters.isActive !== null && filters.isActive !== undefined
        ? `&includeInactive=${filters.isActive}` 
        : '';
    const currentPage = filters?.currentPage
      ? `&CurrentPage=${filters.currentPage}`
      : '';
    
    const res = this.httpService.getRequest(
      `${this.apiController}/local?AuthorityId=${authorityId}&PageSize=10${currentPage}${search}${isActive}`
    );
    return lastValueFrom(res);
  }

  async getUsersNational(filters?: {
    searchText?: string;
    isActive?: boolean;
    currentPage?: number;
  }): Promise<any> {
    const search = filters?.searchText
      ? `&SearchText=${filters.searchText}`
      : '';

    const isActive =
      filters && filters.isActive !== null && filters.isActive !== undefined
        ? `&includeInactive=${filters.isActive}` 
        : '';
    const currentPage = filters?.currentPage
      ? `&CurrentPage=${filters.currentPage}`
      : '';
    
    const res = this.httpService.getRequest(
      `${this.apiController}/global?PageSize=10${currentPage}${search}${isActive}`
    );
    return lastValueFrom(res);
  }

  async createUserNational(body: Record<string, unknown> = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/create/global`,
      body
    );

    return lastValueFrom(res);
  }

  async createUserLocal(body: Record<string, unknown> = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/create/local`,
      body
    );

    return lastValueFrom(res);
  }

  async exportUserLocal(includeInactive = false, authority: string): Promise<Blob> {
    const res = this.httpService.getRequestForBlob(
      `${this.apiController}/export/localUsers?authority=${authority}&includeInactive=${includeInactive}`
    );

    return lastValueFrom(res);
  }

  async exportUserNational(includeInactive = false): Promise<Blob> {
    const res = this.httpService.getRequestForBlob(
      `${this.apiController}/export/global?includeInactive=${includeInactive}`
    );

    return lastValueFrom(res);
  }

  async importUsersLocal(file: File, authorityId: string): Promise<any> {
    const formData = new FormData();
    formData.append('File', file, file.name); // Add the file to the form data

    const res = this.httpService.postRequestWithMultipartHeaders(
      `${this.apiController}/import/local?authority=${authorityId}`,
      formData
    );

    return lastValueFrom(res);
  }

  async updateUserNational(body: Record<string, unknown> = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/update/global`,
      body
    );

    return lastValueFrom(res);
  }

  async updateUserLocal(body: Record<string, unknown> = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/update/local`,
      body
    );

    return lastValueFrom(res);
  }

  async getUserSignature(userID: string): Promise<Blob> {
    const res = this.httpService.getRequestForBlob(
      `${this.apiController}/signature?UserId=${userID}`
    );

    return lastValueFrom(res);
  }

  getGroups() {
    return this.lookupNewService.getGroups();
  }
}
