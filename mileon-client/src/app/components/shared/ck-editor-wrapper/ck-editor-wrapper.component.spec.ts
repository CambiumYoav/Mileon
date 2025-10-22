import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CkEditorWrapperComponent } from './ck-editor-wrapper.component';

describe('CkEditorWrapperComponent', () => {
  let component: CkEditorWrapperComponent;
  let fixture: ComponentFixture<CkEditorWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CkEditorWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CkEditorWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
