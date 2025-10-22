import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedTemplateTextComponent } from './selected-template-text.component';

describe('SelectedTemplateTextComponent', () => {
  let component: SelectedTemplateTextComponent;
  let fixture: ComponentFixture<SelectedTemplateTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectedTemplateTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectedTemplateTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
