import { TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementTableService } from './users-permissions-management-table.service';

describe('UsersPermissionsManagementTableService', () => {
  let service: UsersPermissionsManagementTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersPermissionsManagementTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
