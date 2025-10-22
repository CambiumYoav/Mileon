import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesNoticeTypeComponent } from './notices-notice-type.component';

describe('NoticesNoticeTypeComponent', () => {
  let component: NoticesNoticeTypeComponent;
  let fixture: ComponentFixture<NoticesNoticeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesNoticeTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesNoticeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
