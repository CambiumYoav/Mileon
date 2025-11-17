import { TestBed } from '@angular/core/testing';

import { EmailDialogService } from './email-dialog.service';

describe('EmailDialogService', () => {
  let service: EmailDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
