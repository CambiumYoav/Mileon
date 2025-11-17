import { TestBed } from '@angular/core/testing';

import { SmsDialogService } from './sms-dialog.service';

describe('SmsDialogService', () => {
  let service: SmsDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmsDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
