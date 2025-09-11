import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalTicketBooksComponent } from './terminal-ticket-books.component';

describe('TerminalTicketBooksComponent', () => {
  let component: TerminalTicketBooksComponent;
  let fixture: ComponentFixture<TerminalTicketBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalTicketBooksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalTicketBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
