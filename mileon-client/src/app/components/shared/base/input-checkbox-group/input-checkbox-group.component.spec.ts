import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCheckboxGroupComponent } from './input-checkbox-group.component';

describe('InputCheckboxGroupComponent', () => {
  let component: InputCheckboxGroupComponent;
  let fixture: ComponentFixture<InputCheckboxGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCheckboxGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCheckboxGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
