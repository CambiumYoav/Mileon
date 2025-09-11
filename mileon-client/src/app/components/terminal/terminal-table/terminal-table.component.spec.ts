import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalTableComponent } from './terminal-table.component';

describe('TerminalTableComponent', () => {
  let component: TerminalTableComponent;
  let fixture: ComponentFixture<TerminalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
