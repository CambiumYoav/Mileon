import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApprovedToEnforceComponent } from './admin-approved-to-enforce.component';

describe('AdminApprovedToEnforceComponent', () => {
  let component: AdminApprovedToEnforceComponent;
  let fixture: ComponentFixture<AdminApprovedToEnforceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminApprovedToEnforceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminApprovedToEnforceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
