import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesLogoComponent } from './authority-management-templates-logo.component';

describe('AuthorityManagementTemplatesLogoComponent', () => {
  let component: AuthorityManagementTemplatesLogoComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
