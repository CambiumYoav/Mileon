import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { FieldDynamicComponent } from './field-dynamic.component';

describe('FieldDynamicComponent', () => {
  let component: FieldDynamicComponent;
  let fixture: ComponentFixture<FieldDynamicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldDynamicComponent, ReactiveFormsModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldDynamicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
