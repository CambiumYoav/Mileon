import { TestBed } from '@angular/core/testing';

import { TicketsTableService } from './tickets-table.service';

describe('TicketsTableService', () => {
  let service: TicketsTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
