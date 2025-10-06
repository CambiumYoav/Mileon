import { TestBed } from '@angular/core/testing';

import { UserPremissionsAssignedTableService } from './user-premissions-assigned-table.service';

describe('UserPremissionsAssignedTableService', () => {
  let service: UserPremissionsAssignedTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPremissionsAssignedTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
