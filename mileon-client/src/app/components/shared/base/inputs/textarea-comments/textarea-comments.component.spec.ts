import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextareaCommentsComponent } from './textarea-comments.component';

describe('TextareaCommentsComponent', () => {
  let component: TextareaCommentsComponent;
  let fixture: ComponentFixture<TextareaCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextareaCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextareaCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
