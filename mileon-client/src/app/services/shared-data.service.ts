import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
//FIXME - need refactor with signals
@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  private dataSource = new Subject<any>();
  // private createdAuthoritySource = new Subject<any>();
  data$ = this.dataSource.asObservable();
  // createdAuthority$ = this.createdAuthoritySource.asObservable();
  private createdAuthoritySource = new BehaviorSubject<string | null>(null);
  private validTemplateSource = new BehaviorSubject<{
    key: string;
    value: boolean;
  } | null>(null);
  private templatesSource = new BehaviorSubject<any[]>([]);
  private authorityCreationStatus$ = new BehaviorSubject<boolean>(true);
  templates$ = this.templatesSource.asObservable();
  validTemplateSource$ = this.validTemplateSource.asObservable();
  createdAuthority$ = this.createdAuthoritySource.asObservable();

  emitData(data: any) {
    this.dataSource.next(data);
  }
  setCreatedAuthority(authorityId: string | null) {
    this.createdAuthoritySource.next(authorityId);
  }
  setValidTemplate(template: { key: string; value: boolean }) {
    this.validTemplateSource.next({ key: template.key, value: template.value });
  }

  // setTemplate(template: any) {
  //   const currentTemplates = this.templatesSource.getValue();
  //   const index = currentTemplates.findIndex(
  //     (t) => t.templateId === template.templateId
  //   );

  //   if (index !== -1) {
  //     currentTemplates[index] = template;
  //   } else {
  //     currentTemplates.push(template);
  //   }

  //   this.templatesSource.next([...currentTemplates]);
  // }
  setTemplate(template: any[] | any) {
    if (Array.isArray(template)) {
      this.templatesSource.next(template);
      return;
    }

    const currentTemplates = this.templatesSource.getValue();
    const index = currentTemplates.findIndex(
      (t) => t.templateId === template.templateId
    );

    if (index !== -1) {
      currentTemplates[index] = template;
    } else {
      currentTemplates.push(template);
    }

    this.templatesSource.next([...currentTemplates]);
  }

  setAuthorityCreationStatus(status: boolean) {
    this.authorityCreationStatus$.next(status);
  }
  getAuthorityCreationStatus(): Observable<boolean> {
    return this.authorityCreationStatus$.asObservable();
  }

  getCurrentCreatedAuthority(): string | null {
    return this.createdAuthoritySource.getValue();
  }
}
