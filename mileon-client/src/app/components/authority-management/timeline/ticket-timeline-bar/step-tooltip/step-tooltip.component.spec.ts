import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepTooltipComponent } from './step-tooltip.component';

describe('StepTooltipComponent', () => {
  let component: StepTooltipComponent;
  let fixture: ComponentFixture<StepTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StepTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StepTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
