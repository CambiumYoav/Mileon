import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCheckboxWithTextComponent } from './input-checkbox-with-text.component';

describe('InputCheckboxWithTextComponent', () => {
  let component: InputCheckboxWithTextComponent;
  let fixture: ComponentFixture<InputCheckboxWithTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCheckboxWithTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InputCheckboxWithTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
