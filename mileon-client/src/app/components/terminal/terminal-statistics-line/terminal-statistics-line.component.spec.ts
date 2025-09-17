import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsLineComponent } from './terminal-statistics-line.component';

describe('TerminalStatisticsLineComponent', () => {
  let component: TerminalStatisticsLineComponent;
  let fixture: ComponentFixture<TerminalStatisticsLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
