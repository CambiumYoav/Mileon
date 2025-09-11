import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalTicketBooksFormComponent } from './terminal-ticket-books-form.component';

describe('TerminalTicketBooksFormComponent', () => {
  let component: TerminalTicketBooksFormComponent;
  let fixture: ComponentFixture<TerminalTicketBooksFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalTicketBooksFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalTicketBooksFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
