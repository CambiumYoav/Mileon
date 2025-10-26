import { TestBed } from '@angular/core/testing';

import { AuthorityManagementSearchService } from './authority-management-search.service';

describe('AuthorityManagementSearchService', () => {
  let service: AuthorityManagementSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorityManagementSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
