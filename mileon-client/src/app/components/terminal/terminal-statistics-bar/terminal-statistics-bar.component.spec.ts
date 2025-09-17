import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsBarComponent } from './terminal-statistics-bar.component';

describe('TerminalStatisticsBarComponent', () => {
  let component: TerminalStatisticsBarComponent;
  let fixture: ComponentFixture<TerminalStatisticsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
