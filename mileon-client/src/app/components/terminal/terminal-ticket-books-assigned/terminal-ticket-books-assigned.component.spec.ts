import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalTicketBooksAssignedComponent } from './terminal-ticket-books-assigned.component';

describe('TerminalTicketBooksAssignedComponent', () => {
  let component: TerminalTicketBooksAssignedComponent;
  let fixture: ComponentFixture<TerminalTicketBooksAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalTicketBooksAssignedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalTicketBooksAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
