import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementTableComponent } from './users-permissions-management-table.component';

describe('UsersPermissionsManagementTableComponent', () => {
  let component: UsersPermissionsManagementTableComponent;
  let fixture: ComponentFixture<UsersPermissionsManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPermissionsManagementTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPermissionsManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
