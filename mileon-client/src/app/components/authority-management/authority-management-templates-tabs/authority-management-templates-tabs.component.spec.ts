import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTemplatesTabsComponent } from './authority-management-templates-tabs.component';

describe('AuthorityManagementTemplatesTabsComponent', () => {
  let component: AuthorityManagementTemplatesTabsComponent;
  let fixture: ComponentFixture<AuthorityManagementTemplatesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTemplatesTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTemplatesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
