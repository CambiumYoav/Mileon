import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCheckboxOptionGroupComponent } from './input-checkbox-option-group.component';

describe('InputCheckboxOptionGroupComponent', () => {
  let component: InputCheckboxOptionGroupComponent;
  let fixture: ComponentFixture<InputCheckboxOptionGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InputCheckboxOptionGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InputCheckboxOptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
