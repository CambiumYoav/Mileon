import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementDraftComponent } from './authority-management-draft.component';

describe('AuthorityManagementDraftComponent', () => {
  let component: AuthorityManagementDraftComponent;
  let fixture: ComponentFixture<AuthorityManagementDraftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementDraftComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementDraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
