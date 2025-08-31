import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketActionButtonsComponent } from './ticket-action-buttons.component';

describe('TicketActionButtonsComponent', () => {
  let component: TicketActionButtonsComponent;
  let fixture: ComponentFixture<TicketActionButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketActionButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketActionButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
