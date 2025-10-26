import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementPortalTableComponent } from './authority-management-portal-table.component';

describe('AuthorityManagementPortalTableComponent', () => {
  let component: AuthorityManagementPortalTableComponent;
  let fixture: ComponentFixture<AuthorityManagementPortalTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementPortalTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementPortalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
