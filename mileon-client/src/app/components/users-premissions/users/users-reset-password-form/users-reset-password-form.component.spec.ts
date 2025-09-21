import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersResetPasswordFormComponent } from './users-reset-password-form.component';

describe('UsersResetPasswordFormComponent', () => {
  let component: UsersResetPasswordFormComponent;
  let fixture: ComponentFixture<UsersResetPasswordFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersResetPasswordFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersResetPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
