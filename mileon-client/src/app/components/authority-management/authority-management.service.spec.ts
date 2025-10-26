import { TestBed } from '@angular/core/testing';

import { AuthorityManagementService } from './authority-management.service';

describe('AuthorityManagementService', () => {
  let service: AuthorityManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
