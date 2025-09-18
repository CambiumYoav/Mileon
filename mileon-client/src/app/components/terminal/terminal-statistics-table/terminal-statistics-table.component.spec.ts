import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsTableComponent } from './terminal-statistics-table.component';

describe('TerminalStatisticsTableComponent', () => {
  let component: TerminalStatisticsTableComponent;
  let fixture: ComponentFixture<TerminalStatisticsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
