import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersPermissionsManagementSearchComponent } from './users-permissions-management-search.component';

describe('UsersPermissionsManagementSearchComponent', () => {
  let component: UsersPermissionsManagementSearchComponent;
  let fixture: ComponentFixture<UsersPermissionsManagementSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersPermissionsManagementSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersPermissionsManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
