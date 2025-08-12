import { TestBed } from '@angular/core/testing';

import { LookupNewService } from './lookup-new.service';

describe('LookupNewService', () => {
  let service: LookupNewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LookupNewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
