import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesFormComponent } from './authority-management-templates-form.component';

describe('AuthorityManagementTemplatesFormComponent', () => {
  let component: AuthorityManagementTemplatesFormComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
