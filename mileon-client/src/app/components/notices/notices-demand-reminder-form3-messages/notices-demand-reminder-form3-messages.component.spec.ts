import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesDemandReminderForm3MessagesComponent } from './notices-demand-reminder-form3-messages.component';

describe('NoticesDemandReminderForm3MessagesComponent', () => {
  let component: NoticesDemandReminderForm3MessagesComponent;
  let fixture: ComponentFixture<NoticesDemandReminderForm3MessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesDemandReminderForm3MessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesDemandReminderForm3MessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
