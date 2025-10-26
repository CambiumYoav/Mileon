import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementFormsComponent } from './authority-management-forms.component';

describe('AuthorityManagementFormsComponent', () => {
  let component: AuthorityManagementFormsComponent;
  let fixture: ComponentFixture<AuthorityManagementFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
