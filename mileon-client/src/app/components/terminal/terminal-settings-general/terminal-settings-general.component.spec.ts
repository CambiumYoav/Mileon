import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsGeneralComponent } from './terminal-settings-general.component';

describe('TerminalSettingsGeneralComponent', () => {
  let component: TerminalSettingsGeneralComponent;
  let fixture: ComponentFixture<TerminalSettingsGeneralComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsGeneralComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
