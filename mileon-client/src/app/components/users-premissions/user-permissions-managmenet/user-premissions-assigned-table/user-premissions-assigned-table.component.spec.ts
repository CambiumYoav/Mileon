import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPremissionsAssignedTableComponent } from './user-premissions-assigned-table.component';

describe('UserPremissionsAssignedTableComponent', () => {
  let component: UserPremissionsAssignedTableComponent;
  let fixture: ComponentFixture<UserPremissionsAssignedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserPremissionsAssignedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPremissionsAssignedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
