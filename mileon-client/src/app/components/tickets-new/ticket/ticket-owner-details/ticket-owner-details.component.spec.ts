import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketOwnerDetailsComponent } from './ticket-owner-details.component';

describe('TicketOwnerDetailsComponent', () => {
  let component: TicketOwnerDetailsComponent;
  let fixture: ComponentFixture<TicketOwnerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketOwnerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketOwnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
