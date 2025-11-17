import { TestBed } from '@angular/core/testing';

import { ParkingPermitsService } from './parking-permits.service';

describe('ParkingPermitsService', () => {
  let service: ParkingPermitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingPermitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
