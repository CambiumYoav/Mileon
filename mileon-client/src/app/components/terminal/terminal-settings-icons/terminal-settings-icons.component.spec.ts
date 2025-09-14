import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsIconsComponent } from './terminal-settings-icons.component';

describe('TerminalSettingsIconsComponent', () => {
  let component: TerminalSettingsIconsComponent;
  let fixture: ComponentFixture<TerminalSettingsIconsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsIconsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsIconsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
