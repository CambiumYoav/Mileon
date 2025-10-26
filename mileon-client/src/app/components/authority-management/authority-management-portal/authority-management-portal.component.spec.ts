import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementPortalComponent } from './authority-management-portal.component';

describe('AuthorityManagementPortalComponent', () => {
  let component: AuthorityManagementPortalComponent;
  let fixture: ComponentFixture<AuthorityManagementPortalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementPortalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
