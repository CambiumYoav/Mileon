;
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { ErrorSuccessMessages } from '../../types/enum/error-success-messages';
import { ParkingPermitFilterOptions } from '../../types/filters/parking-permit/parkingPermitFilterOptions';
import { ListCountResult } from '../../types/listCountResult';
import { ParkingPermit } from '../../types/parkingPermit/parkingPermit';
import { ParkingPermitAuthorityConfig } from '../../types/parkingPermit/parkingPermitAuthorityConfig';
import { ParkingPermitDetails } from '../../types/parkingPermit/parkingPermitDetails';
import { ParkingPermitStatus } from '../../types/parkingPermit/parkingPermitStatus';
import { Summary } from '../../types/summary.model';

@Injectable({
  providedIn: 'root',
})
export class ParkingPermitsService {
  apiController = 'ParkingPermit';

  constructor(private httpService: HttpService) {}

  getParkingPermitById(parkingPermitId: string) {
    const res = this.httpService.getRequest(
      `${this.apiController}/${parkingPermitId}`
    );
    return lastValueFrom(res);
  }

  getParkingPermitFilesById(parkingPermitId: string) {
    const res = this.httpService.getRequest<File>(
      `${this.apiController}/${parkingPermitId}/files`
    );
    return lastValueFrom(res);
  }

  getParkingPermitDocumentTypesByAuthorityID(authorityID: string) {
    const res = this.httpService.getRequest<File>(
      `${this.apiController}/fileTyps/${authorityID}`
    );
    return lastValueFrom(res);
  }

  updateParkingPermit(parkingPermit: any | {}): Promise<ParkingPermitDetails> {
    const url = `${this.apiController}/UpdateParkingPermit`;
    const res = this.httpService.formDataPostRequest<ParkingPermitDetails>(
      url,
      parkingPermit
    );
    return lastValueFrom(res);
  }


  getAuthorityPermitConfiguration(
    authorityID: string
  ): Promise<ParkingPermitAuthorityConfig> {
    const url = `${this.apiController}/ParkingPermitConfigurations`;
    const res = this.httpService.getRequest(url + '/' + authorityID);
    return lastValueFrom(res);
  }

  updateParkingPermitStatus(
    parkingPermitStatus: ParkingPermitStatus
  ): Promise<ParkingPermit> {
    const url = `${this.apiController}/UpdateStatus`;
    const res = this.httpService.postRequest(
      url,
      parkingPermitStatus,
      ErrorSuccessMessages.SUCCESS
    );
    return lastValueFrom(res);
  }

  fetchParkingPermitsList(
    body = {}
  ): Promise<ListCountResult<ParkingPermitFilterOptions>> | null {
    const res = this.httpService.postRequest(`${this.apiController}`, body);
    return lastValueFrom(res);
  }

  // it's duplicated 'updateParkingPermit'
  createParkingPermit(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/CreateOrUpdate`,
      body
    );
    return lastValueFrom(res);
  }

  uploadFileParkingPermit(body = {}) {
    const res = this.httpService.formDataPostRequest(
      `${this.apiController}/uploadFile`,
      body
    );
    return lastValueFrom(res);
  }

  deleteParkingPermitFile(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/deleteFile`,
      body,
      ErrorSuccessMessages.DELETE_SUCCESSFULLY
    );
    return lastValueFrom(res);
  }

  getMainSummary(authorityId: string): Promise<Summary> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/Summary`
    );
    return lastValueFrom(res);
  }

  getBackOfficeMainTable(
    authorityId: string
  ): Promise<ListCountResult<ParkingPermit>> {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/Summary/List`
    );
    return lastValueFrom(res);
  }

  getParkingPermitTypes(authorityId: string, body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/Types?authorityID=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }

  exportParkingPermitTypes(authorityId: string, body = {}): Promise<any> {
    const res = this.httpService.postRequestForBlob(
      `${this.apiController}/ExportPermitTypes?authorityID=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }

  updateNumberOfPermits(authorityId: string, value: string) {
    const res = this.httpService.postRequest(
      `${this.apiController}/${authorityId}/PermitsById?value=${value}`,
      {}
    );
    return lastValueFrom(res);
  }

  getNumberOfPermits(authorityId: string) {
    const res = this.httpService.getRequest(
      `${this.apiController}/${authorityId}/PermitsById`
    );
    return lastValueFrom(res);
  }

  updateIsActive(id: string, isActive: boolean) {
    const res = this.httpService.postRequest(
      `${this.apiController}/UpdateIsActive?id=${id}&isActive=${isActive}`,
      {}
    );
    return lastValueFrom(res);
  }

  createOrUpadatePermitType(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/CreateOrUpdatePermitType`,
      body
    );
    return lastValueFrom(res);
  }

  getPermitTypeById(id: number) {
    const res = this.httpService.getRequest(
      `${this.apiController}/${id}/PermitById`
    );
    return lastValueFrom(res);
  }

  importPermitTypes(authorityId: string, file: any) {
    const formData = new FormData();
    formData.append('File', file, file.name);
    const res = this.httpService.postRequestWithMultipartHeaders(
      `${this.apiController}/ImportExcelPermitTypes?authorityId=${authorityId}`,
      formData
    );
    return lastValueFrom(res);
  }

  //file types for permit types

  getPermitFileTypesById(permitTypeId: string | number) {
    const res = this.httpService.getRequest(
      `${this.apiController}/GetPermitFileTypesById?parkingPermitTypeId=${permitTypeId}`
    );
    return lastValueFrom(res);
  }

  createOrUpdatePermitFileType(
    body: any,
    authorityID: string,
    permitTypeId: string
  ) {
    const res = this.httpService.postRequest(
      `${this.apiController}/CreateOrUpdatePermitFileType/${permitTypeId}?authorityId=${authorityID}`,
      body
    );
    return lastValueFrom(res);
  }



  createParkingPermitNew(
    parkingPermit: ParkingPermitDetails | {}
  ): Promise<ParkingPermitDetails> {
    console.log(parkingPermit);
    const url = `${this.apiController}/CreateParkingPermit`;
    const res = this.httpService.formDataPostRequest<ParkingPermitDetails>(
      url,
      parkingPermit,
      false
    );
    return lastValueFrom(res);
  }

  exportParkingPermits(body = {}): Promise<any> {
    const res = this.httpService.postRequestForBlob(
      `${this.apiController}/ExportParkingPermitsToExcel`,
      body
    );
    return lastValueFrom(res);
  }

  importParkingPermits(authorityId: string, file: any) {
    const formData = new FormData();
    formData.append('File', file, file.name);
    const res = this.httpService.postRequestWithMultipartHeaders(
      `${this.apiController}/ImportParkingPermitsFromExcel?authorityID=${authorityId}`,
      formData
    );
    return lastValueFrom(res);
  }

  renewParkingPermitTrigger(userId: string, body = {}) {
    const res = this.httpService.postRequestForLambda(
      `parkingpermits/ParkingPermitRenew?userId=${userId}`,
      body
    );
    return lastValueFrom(res);
  }
}
