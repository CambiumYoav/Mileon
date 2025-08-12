import { TestBed } from '@angular/core/testing';

import { ParkingPermitService } from './parking-permit.service';

describe('ParkingPermitService', () => {
  let service: ParkingPermitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingPermitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
