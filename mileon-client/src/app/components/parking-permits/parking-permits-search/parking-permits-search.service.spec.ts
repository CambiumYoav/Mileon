import { TestBed } from '@angular/core/testing';

import { ParkingPermitsSearchService } from './parking-permits-search.service';

describe('ParkingPermitsSearchService', () => {
  let service: ParkingPermitsSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingPermitsSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
