import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementImageTemplatesComponent } from './authority-management-image-templates.component';

describe('AuthorityManagementImageTemplatesComponent', () => {
  let component: AuthorityManagementImageTemplatesComponent;
  let fixture: ComponentFixture<AuthorityManagementImageTemplatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementImageTemplatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementImageTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
