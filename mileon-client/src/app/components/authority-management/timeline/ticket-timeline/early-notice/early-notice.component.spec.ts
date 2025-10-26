import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyNoticeComponent } from './early-notice.component';

describe('EarlyNoticeComponent', () => {
  let component: EarlyNoticeComponent;
  let fixture: ComponentFixture<EarlyNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyNoticeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EarlyNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
