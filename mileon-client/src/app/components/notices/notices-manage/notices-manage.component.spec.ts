import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticesManageComponent } from './notices-manage.component';

describe('NoticesManageComponent', () => {
  let component: NoticesManageComponent;
  let fixture: ComponentFixture<NoticesManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoticesManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticesManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
