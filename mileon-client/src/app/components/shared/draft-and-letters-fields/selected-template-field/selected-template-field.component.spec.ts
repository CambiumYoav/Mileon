import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedTemplateFieldComponent } from './selected-template-field.component';

describe('SelectedTemplateFieldComponent', () => {
  let component: SelectedTemplateFieldComponent;
  let fixture: ComponentFixture<SelectedTemplateFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedTemplateFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedTemplateFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
