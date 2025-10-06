import { TestBed } from '@angular/core/testing';

import { UserPremissionsManagmentService } from './user-premissions-managment.service';

describe('UserPremissionsManagmentService', () => {
  let service: UserPremissionsManagmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserPremissionsManagmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
