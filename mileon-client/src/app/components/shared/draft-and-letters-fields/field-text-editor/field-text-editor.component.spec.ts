import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldTextEditorComponent } from './field-text-editor.component';

describe('FieldTextEditorComponent', () => {
  let component: FieldTextEditorComponent;
  let fixture: ComponentFixture<FieldTextEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldTextEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldTextEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
