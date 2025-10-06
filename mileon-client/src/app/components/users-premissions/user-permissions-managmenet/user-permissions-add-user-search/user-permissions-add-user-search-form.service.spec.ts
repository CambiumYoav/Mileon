import { TestBed } from '@angular/core/testing';

import { UserPermissionsAddUserSearchFormService } from './user-permissions-add-user-search-form.service';

describe('UserPermissionsAddUserSearchFormService', () => {
  let service: UserPermissionsAddUserSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPermissionsAddUserSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
