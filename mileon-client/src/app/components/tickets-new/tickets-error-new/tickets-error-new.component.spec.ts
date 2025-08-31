import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsErrorNewComponent } from './tickets-error-new.component';

describe('TicketsErrorNewComponent', () => {
  let component: TicketsErrorNewComponent;
  let fixture: ComponentFixture<TicketsErrorNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketsErrorNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketsErrorNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
