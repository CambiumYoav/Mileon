import { TestBed } from '@angular/core/testing';

import { ParkingPermitsFlowService } from './parking-permit-flow.service';

describe('ParkingPermitsFlowService', () => {
  let service: ParkingPermitsFlowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParkingPermitsFlowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
