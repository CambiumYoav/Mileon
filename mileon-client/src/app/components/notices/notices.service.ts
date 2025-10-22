import { Injectable } from '@angular/core';
import { TicketsService } from '../tickets-new/tickets.service';
import { HttpService } from '../../services/http.service';
import { lastValueFrom } from 'rxjs';
import {
  InterfaceTypes,
  PostTypeEnum,
} from '../../types/enum/noticesInterfacesEnum';

@Injectable({
  providedIn: 'root',
})
export class NoticesService {
  apiController = 'Productions';
  manotApiController = 'Manot';

  constructor(
    private ticketsService: TicketsService,
    private httpService: HttpService
  ) {}

  generateTicketsPdf() {
    const res = this.httpService.getRequest(`generateTicketsPdf`);
    return lastValueFrom(res);
  }

  getStagingFile(body = {}): Promise<any> {
    const res = this.httpService.postRequestForBlobAsResponse(
      `${this.apiController}/StagingFile`,
      body
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error getting staging file:', error);
      throw error;
    });
  }

  getFinalFile(
    body = {},
    templateId: string,
    interfaceType: InterfaceTypes = InterfaceTypes.Printing,
    printingType: string,
    postType?: PostTypeEnum
  ): Promise<any> {
    const res = this.httpService.postRequestForBlobAsResponse(
      `${this.apiController}/FinalFile?templateId=${templateId}&interfaceType=${interfaceType}&printingType=${printingType}&postType=${postType}`,
      body
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error getting final file:', error);
      throw error;
    });
  }
  //should be post not with file
  // generateFinalFilePdf(body = {}, templateId: string): Promise<any> {
  //   const res = this.httpService.postRequestForBlobAsResponseForPdfCheck(
  //     `GenerateTicketsPdf?templateId=${templateId}`,
  //     body
  //   );

  //   return lastValueFrom(res);
  // }

  // cjeck this
  // generateFinalFilePdf(
  //   body = {},
  //   templateId: string,
  //   authorityId: string,
  //   userId:string
  // ): Promise<any> {
  //   const res = this.httpService.postRequestForPdfCheck(
  //     `GenerateTicketsPdf?templateId=${templateId}&authorityId=${authorityId}&userId=${userId}`,
  //     body
  //   );

  //   return lastValueFrom(res);
  // }
  generateFinalFilePdf(
    body = {},
    templateId: string,
    authorityId: string,
    userId: string,
    printingType: string,
    postType?: PostTypeEnum,
    isCombined: boolean = true
  ): Promise<any> {
    const res = this.httpService.postRequest(
      `GenerateTicketsPdf?templateId=${templateId}&authorityId=${authorityId}&userId=${userId}&printingType=${printingType}&postType=${postType}&isCombined=${isCombined}`,
      body
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error generating final file PDF:', error);
      throw error;
    });
  }
  getProductionTickets(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/GetProductionTickets`,
      body
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error getting production tickets:', error);
      throw error;
    });
  }

  getManot(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/GetManot`,
      body
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error getting manot:', error);
      throw error;
    });
  }

  getMana(manaId: string) {
    const res = this.httpService.getRequestForBlob(
      `${this.manotApiController}/GetMana?ManaId=${manaId}`,
      {}
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error getting mana:', error);
      throw error;
    });
  }
  restoreManaLocal(authorityId: string, manaId: string) {
    const res = this.httpService.getRequestForBlob(
      `RestoreMana/Local?authorityId=${authorityId}&ManaId=${manaId}`
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error restoring mana local:', error);
      throw error;
    });
  }

  restoreMana(manaId: string) {
    const res = this.httpService.getRequestForBlob(
      `${this.manotApiController}/RestoreMana/Print?ManaId=${manaId}`
    );

    return lastValueFrom(res).catch(error => {
      console.error('Error restoring mana:', error);
      throw error;
    });
  }

  uploadFile(body = {}) {
    const res = this.httpService.postRequest(
      `${this.apiController}/UploadFile`,
      body
    );
    return lastValueFrom(res).catch(error => {
      console.error('Error uploading file:', error);
      throw error;
    });
  }
}
