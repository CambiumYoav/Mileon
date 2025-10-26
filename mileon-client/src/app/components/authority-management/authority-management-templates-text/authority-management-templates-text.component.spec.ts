import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesTextComponent } from './authority-management-templates-text.component';

describe('AuthorityManagementTemplatesTextComponent', () => {
  let component: AuthorityManagementTemplatesTextComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesTextComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
