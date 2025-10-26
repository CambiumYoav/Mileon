import { TestBed } from '@angular/core/testing';

import { AuthorityManagementTableService } from './authority-management-forms-table.service';

describe('AuthorityManagementTableService', () => {
  let service: AuthorityManagementTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityManagementTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
