import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsDropdownComponent } from './results-dropdown.component';

describe('ResultsDropdownComponent', () => {
  let component: ResultsDropdownComponent;
  let fixture: ComponentFixture<ResultsDropdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultsDropdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
