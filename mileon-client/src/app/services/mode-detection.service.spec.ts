import { TestBed } from '@angular/core/testing';

import { ModeDetectionService } from './mode-detection.service';

describe('ModeDetectionService', () => {
  let service: ModeDetectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModeDetectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
