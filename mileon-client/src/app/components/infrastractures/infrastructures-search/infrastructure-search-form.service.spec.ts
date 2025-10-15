import { TestBed } from '@angular/core/testing';

import { InfrastructureSearchFormService } from './infrastructure-search-form.service';

describe('InfrastructureSearchFormService', () => {
  let service: InfrastructureSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfrastructureSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
