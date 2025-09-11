import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalInspectorDailyComponent } from './terminal-inspector-daily.component';

describe('TerminalInspectorDailyComponent', () => {
  let component: TerminalInspectorDailyComponent;
  let fixture: ComponentFixture<TerminalInspectorDailyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalInspectorDailyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalInspectorDailyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
