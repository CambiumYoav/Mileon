import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPermissionsAddUserSearchComponent } from './user-permissions-add-user-search.component';

describe('UserPermissionsAddUserSearchComponent', () => {
  let component: UserPermissionsAddUserSearchComponent;
  let fixture: ComponentFixture<UserPermissionsAddUserSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPermissionsAddUserSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPermissionsAddUserSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
