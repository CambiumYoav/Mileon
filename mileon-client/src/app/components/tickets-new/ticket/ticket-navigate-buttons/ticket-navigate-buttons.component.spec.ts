import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketNavigateButtonsComponent } from './ticket-navigate-buttons.component';

describe('TicketNavigateButtonsComponent', () => {
  let component: TicketNavigateButtonsComponent;
  let fixture: ComponentFixture<TicketNavigateButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketNavigateButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketNavigateButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
