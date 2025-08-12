import { TestBed } from '@angular/core/testing';

import { CkEditorService } from './ck-editor.service';

describe('CkEditorService', () => {
  let service: CkEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CkEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
