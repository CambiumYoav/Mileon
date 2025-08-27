import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadNewComponent } from './upload-files.component';

describe('FileUploadNewComponent', () => {
  let component: FileUploadNewComponent;
  let fixture: ComponentFixture<FileUploadNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileUploadNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
