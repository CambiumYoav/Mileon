import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementComponent } from './users-permissions-management.component';

describe('UsersPermissionsManagementComponent', () => {
  let component: UsersPermissionsManagementComponent;
  let fixture: ComponentFixture<UsersPermissionsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPermissionsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPermissionsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
