import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentPreviewNewComponent } from './document-preview-new.component';

describe('DocumentPreviewNewComponent', () => {
  let component: DocumentPreviewNewComponent;
  let fixture: ComponentFixture<DocumentPreviewNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentPreviewNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentPreviewNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
