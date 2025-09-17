import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalStatisticsPieComponent } from './terminal-statistics-pie.component';

describe('TerminalStatisticsPieComponent', () => {
  let component: TerminalStatisticsPieComponent;
  let fixture: ComponentFixture<TerminalStatisticsPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalStatisticsPieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalStatisticsPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
