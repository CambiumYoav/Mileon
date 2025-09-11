import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalExportComponent } from './terminal-export.component';

describe('TerminalExportComponent', () => {
  let component: TerminalExportComponent;
  let fixture: ComponentFixture<TerminalExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
