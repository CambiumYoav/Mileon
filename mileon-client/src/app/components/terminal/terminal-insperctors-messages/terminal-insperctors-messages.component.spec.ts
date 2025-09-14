import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalInsperctorsMessagesComponent } from './terminal-insperctors-messages.component';

describe('TerminalInsperctorsMessagesComponent', () => {
  let component: TerminalInsperctorsMessagesComponent;
  let fixture: ComponentFixture<TerminalInsperctorsMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalInsperctorsMessagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalInsperctorsMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
