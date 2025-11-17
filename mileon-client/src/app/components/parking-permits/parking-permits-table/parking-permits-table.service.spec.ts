import { TestBed } from '@angular/core/testing';

import { ParkingPermitsTableService } from './parking-permits-table.service';

describe('ParkingPermitsTableService', () => {
  let service: ParkingPermitsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingPermitsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
