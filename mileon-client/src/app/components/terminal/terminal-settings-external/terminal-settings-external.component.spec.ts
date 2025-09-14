import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsExternalComponent } from './terminal-settings-external.component';

describe('TerminalSettingsExternalComponent', () => {
  let component: TerminalSettingsExternalComponent;
  let fixture: ComponentFixture<TerminalSettingsExternalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsExternalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
