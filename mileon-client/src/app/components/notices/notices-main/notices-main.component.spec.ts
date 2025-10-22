import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesMainComponent } from './notices-main.component';

describe('NoticesMainComponent', () => {
  let component: NoticesMainComponent;
  let fixture: ComponentFixture<NoticesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
