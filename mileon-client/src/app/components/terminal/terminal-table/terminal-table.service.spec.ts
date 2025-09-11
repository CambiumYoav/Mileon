import { TestBed } from '@angular/core/testing';

import { TerminalTableService } from './terminal-table.service';

describe('TerminalTableService', () => {
  let service: TerminalTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminalTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
