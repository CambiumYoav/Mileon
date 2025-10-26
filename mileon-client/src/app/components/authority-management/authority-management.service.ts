import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '../../services/http.service';
import { DraftsAndLettersResponse } from '../../types/drafts-and-letters/DraftsAndLettersResponseById';
import { TemplatesTypesEnum } from '../../types/enum/templatesTypesEnum';
import { SystemFieldModuleEnum } from '../../types/enum/systemFiledEnum';

@Injectable({
  providedIn: 'root',
})
export class AuthorityManagementService {
  apiController = 'AuthorityManagement';
  authorityFormsApiController = 'AuthorityForms';
  templatesApiController = 'Template';
  draftsAndLettersApiContoller = 'DraftsAndLetters';
  systemFieldApiController = 'SystemField';

  constructor(private httpService: HttpService) {}

  getAuthorityWithCustomer(authorityId: string): Promise<any> {
    const res = this.httpService.getRequest(
      `${this.apiController}/GetAuthorityWithCustomer?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  createAndUpdateAuthorityWithCustomer(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/CreateAuthorityWithCustomer`,
      body
    );
    return lastValueFrom(res);
  }

  updateAuthority(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/UpdateAuthority`,
      body
    );
    return lastValueFrom(res);
  }

  getAuthorityWidgets(authorityId: string): Promise<any> {
    const res = this.httpService.getRequest(
      `${this.apiController}/GetAuthorityWidgets?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  updateAuthorityWidgets(authorityId: string, body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/UpdateAuthorityWidgets?authorityId=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }

  addAuthority(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/AddAuthority`,
      body
    );
    return lastValueFrom(res);
  }

  getAuthoritySubDomain(authorityId: string): Promise<any> {
    const res = this.httpService.getRequest(
      `${this.apiController}/GetAuthoritySubDomain?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  updateAuthoritySubDomain(
    authorityId: string,
    subDomain: string
  ): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/UpdateAuthoritySubDomain?authorityId=${authorityId}&portalSubDomain=${subDomain}`,
      {}
    );
    return lastValueFrom(res);
  }

  updateIsCreated(authorityId: string, isCreated: boolean): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.apiController}/UpdateIsCreated?AuthorityID=${authorityId}&IsCreated=${isCreated}`,
      {}
    );
    return lastValueFrom(res);
  }

  //------AuthorityForms------//

  createFormForAuthority(authorityId: String, body = {}) {
    const res = this.httpService.postRequest(
      `${this.authorityFormsApiController}/CreateFormForAuthority?authorityId=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }

  createAuthorityFormsAndFields(authorityId: String, body = {}) {
    const res = this.httpService.postRequest(
      `${this.authorityFormsApiController}/CreateAuthorityFormsAndFields?authorityId=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }
  getFormsByAuthority(authorityId: String) {
    const res = this.httpService.getRequest(
      `${this.authorityFormsApiController}/GetFormByAuthority?authorityId=${authorityId}`
    );
    return lastValueFrom(res);
  }

  getFormFieldsByForm(formId: String) {
    const res = this.httpService.getRequest(
      `${this.authorityFormsApiController}/GetFormFieldsByForm?FormId=${formId}`
    );
    return lastValueFrom(res);
  }

  updateAuthorityForm(body = {}) {
    const res = this.httpService.postRequest(
      `${this.authorityFormsApiController}/UpdateFormFields`,
      body
    );
    return lastValueFrom(res);
  }

  //-----Templates-----//
  getTemplatesTypes(): Promise<any> {
    const res = this.httpService.getRequest(
      `${this.templatesApiController}/GetTemplatesTypes`
    );
    return lastValueFrom(res);
  }

  getTemplates(
    authorityId: string,
    templateTypeId: TemplatesTypesEnum,
    body = {}
  ): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.templatesApiController}/GetTemplates?authorityId=${authorityId}&templateTypeId=${templateTypeId}`,
      body
    );
    return lastValueFrom(res);
  }

  updateTemplate(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.templatesApiController}/UpdateTemplate`,
      body
    );
    return lastValueFrom(res);
  }

  createTemplate(authorityId: string, body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.templatesApiController}/CreateTemplate?authorityId=${authorityId}`,
      body
    );
    return lastValueFrom(res);
  }

  getTemplatesValueByIds(ids: {}) {
    const res = this.httpService.postRequest(
      `${this.templatesApiController}/GetTemplatesValue`,
      ids
    );
    return lastValueFrom(res);
  }
  //-----Drafts and Letters-----//
  getDraftsAndLetters(body = {}): Promise<any> {
    const res = this.httpService.postRequest(
      `${this.draftsAndLettersApiContoller}/GetDraftsAndLetters`,
      body
    );
    return lastValueFrom(res);
  }
  exportDraftsAndLetters(body = {}) {
    const res = this.httpService.postRequestForBlob(
      `${this.draftsAndLettersApiContoller}/export`,
      body
    );
    return lastValueFrom(res);
  }

  updateIsActive(gid: string, isActive: boolean) {
    const res = this.httpService.postRequest(
      `${this.draftsAndLettersApiContoller}/UpdateIsActive?id=${gid}&isActive=${isActive}`,
      {}
    );
    return lastValueFrom(res);
  }

  //NOTE -  crate type for the body?
  createOrUpdateDraftAndLetter(body = {}) {
    const res = this.httpService.postRequest(
      `${this.draftsAndLettersApiContoller}/CreateOrUpdateDraftsAndLetters`,
      body
    );
    return lastValueFrom(res);
  }

  getDraftAndLetterById(id: string): Promise<DraftsAndLettersResponse> {
    const res = this.httpService.getRequest(
      `${this.draftsAndLettersApiContoller}/GetDraftsAndLettersbyId?id=${id}`
    );
    return lastValueFrom(res);
  }

  createCopy(id: string): Promise<DraftsAndLettersResponse> {
    const res = this.httpService.postRequest(
      `${this.draftsAndLettersApiContoller}/CreateCopy?id=${id}`,
      {}
    );
    return lastValueFrom(res);
  }

  //-----System Fields-----//
  getSystemFields(moduleId?: SystemFieldModuleEnum, body = {}) {
    const query = moduleId != null ? `?moduleId=${moduleId}` : '';
    const url = `${this.systemFieldApiController}/GetSystemFields${query}`;
    const res = this.httpService.postRequest(url, body);
    return lastValueFrom(res);
  }
}
