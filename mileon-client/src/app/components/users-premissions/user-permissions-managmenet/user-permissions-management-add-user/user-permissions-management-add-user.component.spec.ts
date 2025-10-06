import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsManagementAddUserComponent } from './user-permissions-management-add-user.component';

describe('UserPermissionsManagementAddUserComponent', () => {
  let component: UserPermissionsManagementAddUserComponent;
  let fixture: ComponentFixture<UserPermissionsManagementAddUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionsManagementAddUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionsManagementAddUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
