import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesComponent } from './authority-management-templates.component';

describe('AuthorityManagementTemplatesComponent', () => {
  let component: AuthorityManagementTemplatesComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
