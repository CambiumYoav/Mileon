import { TestBed } from '@angular/core/testing';

import { NoticesTableService } from './notices-table.service';

describe('NoticesTableService', () => {
  let service: NoticesTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NoticesTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
