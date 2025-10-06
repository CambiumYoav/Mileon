import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementAssignedComponent } from './users-permissions-management-assigned.component';

describe('UsersPermissionsManagementAssignedComponent', () => {
  let component: UsersPermissionsManagementAssignedComponent;
  let fixture: ComponentFixture<UsersPermissionsManagementAssignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPermissionsManagementAssignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPermissionsManagementAssignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
