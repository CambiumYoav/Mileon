import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementLetterComponent } from './authority-management-letter.component';

describe('AuthorityManagementLetterComponent', () => {
  let component: AuthorityManagementLetterComponent;
  let fixture: ComponentFixture<AuthorityManagementLetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementLetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
