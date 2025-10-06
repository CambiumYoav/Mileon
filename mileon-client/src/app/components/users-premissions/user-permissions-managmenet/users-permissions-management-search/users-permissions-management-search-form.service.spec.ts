import { TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementSearchFormService } from './users-permissions-management-search-form.service';

describe('UsersPermissionsManagementSearchFormService', () => {
  let service: UsersPermissionsManagementSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersPermissionsManagementSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
