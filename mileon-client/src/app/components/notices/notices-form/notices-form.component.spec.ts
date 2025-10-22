import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesFormComponent } from './notices-form.component';

describe('NoticesFormComponent', () => {
  let component: NoticesFormComponent;
  let fixture: ComponentFixture<NoticesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
