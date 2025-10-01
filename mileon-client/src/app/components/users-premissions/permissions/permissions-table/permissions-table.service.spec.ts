import { TestBed } from '@angular/core/testing';

import { PermissionsTableService } from './permissions-table.service';

describe('PermissionsTableService', () => {
  let service: PermissionsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PermissionsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
