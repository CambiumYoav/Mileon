import { TestBed } from '@angular/core/testing';

import { PermissionsSearchFormService } from './permissions-search-form.service';

describe('PermissionsSearchFormService', () => {
  let service: PermissionsSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
