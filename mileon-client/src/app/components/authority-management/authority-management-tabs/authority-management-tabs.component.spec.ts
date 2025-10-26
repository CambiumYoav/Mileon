import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTabsComponent } from './authority-management-tabs.component';

describe('AuthorityManagementTabsComponent', () => {
  let component: AuthorityManagementTabsComponent;
  let fixture: ComponentFixture<AuthorityManagementTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
