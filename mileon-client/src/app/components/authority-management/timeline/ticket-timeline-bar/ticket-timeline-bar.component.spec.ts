import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketTimelineBarComponent } from './ticket-timeline-bar.component';

describe('TicketTimelineBarComponent', () => {
  let component: TicketTimelineBarComponent;
  let fixture: ComponentFixture<TicketTimelineBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketTimelineBarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketTimelineBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
