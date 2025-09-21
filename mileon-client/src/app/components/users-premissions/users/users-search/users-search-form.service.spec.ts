import { TestBed } from '@angular/core/testing';

import { UsersSearchFormService } from './users-search-form.service';

describe('UsersSearchFormService', () => {
  let service: UsersSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
