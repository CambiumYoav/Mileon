import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsComponent } from './terminal-settings.component';

describe('TerminalSettingsComponent', () => {
  let component: TerminalSettingsComponent;
  let fixture: ComponentFixture<TerminalSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
