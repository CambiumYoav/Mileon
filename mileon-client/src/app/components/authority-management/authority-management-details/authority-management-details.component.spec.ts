import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementDetailsComponent } from './authority-management-details.component';

describe('AuthorityManagementDetailsComponent', () => {
  let component: AuthorityManagementDetailsComponent;
  let fixture: ComponentFixture<AuthorityManagementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
