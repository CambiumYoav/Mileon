import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementSearchComponent } from './authority-management-search.component';

describe('AuthorityManagementSearchComponent', () => {
  let component: AuthorityManagementSearchComponent;
  let fixture: ComponentFixture<AuthorityManagementSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
