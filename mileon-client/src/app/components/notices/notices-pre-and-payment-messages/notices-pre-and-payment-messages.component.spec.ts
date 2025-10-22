import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesPreAndPaymentMessagesComponent } from './notices-pre-and-payment-messages.component';

describe('NoticesPreAndPaymentMessagesComponent', () => {
  let component: NoticesPreAndPaymentMessagesComponent;
  let fixture: ComponentFixture<NoticesPreAndPaymentMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesPreAndPaymentMessagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesPreAndPaymentMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
