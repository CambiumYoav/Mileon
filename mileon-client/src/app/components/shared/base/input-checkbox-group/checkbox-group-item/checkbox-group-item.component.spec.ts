import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxGroupItemComponent } from './checkbox-group-item.component';

describe('CheckboxGroupItemComponent', () => {
  let component: CheckboxGroupItemComponent;
  let fixture: ComponentFixture<CheckboxGroupItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxGroupItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckboxGroupItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
