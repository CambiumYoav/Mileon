import { TestBed } from '@angular/core/testing';

import { TicketsSearchFormService } from './tickets-search-form.service';

describe('TicketsSearchFormService', () => {
  let service: TicketsSearchFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsSearchFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
