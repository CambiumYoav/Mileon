import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesSignatureComponent } from './authority-management-templates-signature.component';

describe('AuthorityManagementTemplatesSignatureComponent', () => {
  let component: AuthorityManagementTemplatesSignatureComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesSignatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesSignatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesSignatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
