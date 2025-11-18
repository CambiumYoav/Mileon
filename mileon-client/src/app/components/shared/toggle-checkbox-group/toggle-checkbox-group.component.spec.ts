import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleCheckboxGroupComponent } from './toggle-checkbox-group.component';

describe('ToggleCheckboxGroupComponent', () => {
  let component: ToggleCheckboxGroupComponent;
  let fixture: ComponentFixture<ToggleCheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToggleCheckboxGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToggleCheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
