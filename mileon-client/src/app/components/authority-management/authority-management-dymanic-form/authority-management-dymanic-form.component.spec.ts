import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementDymanicFormComponent } from './authority-management-dymanic-form.component';

describe('AuthorityManagementDymanicFormComponent', () => {
  let component: AuthorityManagementDymanicFormComponent;
  let fixture: ComponentFixture<AuthorityManagementDymanicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementDymanicFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementDymanicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
