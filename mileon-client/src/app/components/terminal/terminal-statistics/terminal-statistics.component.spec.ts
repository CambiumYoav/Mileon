import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsComponent } from './terminal-statistics.component';

describe('TerminalStatisticsComponent', () => {
  let component: TerminalStatisticsComponent;
  let fixture: ComponentFixture<TerminalStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
