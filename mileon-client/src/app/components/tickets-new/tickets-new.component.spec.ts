import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsNewComponent } from './tickets-new.component';

describe('TicketsNewComponent', () => {
  let component: TicketsNewComponent;
  let fixture: ComponentFixture<TicketsNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsNewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
