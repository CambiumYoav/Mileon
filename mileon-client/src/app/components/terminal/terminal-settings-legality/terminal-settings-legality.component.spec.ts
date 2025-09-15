import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsLegalityComponent } from './terminal-settings-legality.component';

describe('TerminalSettingsLegalityComponent', () => {
  let component: TerminalSettingsLegalityComponent;
  let fixture: ComponentFixture<TerminalSettingsLegalityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsLegalityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsLegalityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
