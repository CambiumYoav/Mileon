import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsTabsComponent } from './terminal-statistics-tabs.component';

describe('TerminalStatisticsTabsComponent', () => {
  let component: TerminalStatisticsTabsComponent;
  let fixture: ComponentFixture<TerminalStatisticsTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
