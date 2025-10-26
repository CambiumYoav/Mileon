import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebtReminderComponent } from './debt-reminder.component';

describe('DebtReminderComponent', () => {
  let component: DebtReminderComponent;
  let fixture: ComponentFixture<DebtReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebtReminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebtReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
