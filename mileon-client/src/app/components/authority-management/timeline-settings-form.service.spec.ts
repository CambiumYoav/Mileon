import { TestBed } from '@angular/core/testing';

import { TimelineSettingsFormService } from './timeline-settings-form.service';

describe('TimelineSettingsFormService', () => {
  let service: TimelineSettingsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TimelineSettingsFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
