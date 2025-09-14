import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsTabsComponent } from './terminal-settings-tabs.component';

describe('TerminalSettingsTabsComponent', () => {
  let component: TerminalSettingsTabsComponent;
  let fixture: ComponentFixture<TerminalSettingsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
