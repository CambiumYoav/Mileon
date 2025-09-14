import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalSettingsColumnComponent } from './terminal-settings-column.component';

describe('TerminalSettingsColumnComponent', () => {
  let component: TerminalSettingsColumnComponent;
  let fixture: ComponentFixture<TerminalSettingsColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalSettingsColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalSettingsColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
