import { TestBed } from '@angular/core/testing';

import { TerminalSearchService } from './terminal-search.service';

describe('TerminalSearchService', () => {
  let service: TerminalSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerminalSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
