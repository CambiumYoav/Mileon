import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementMainComponent } from './authority-management-main.component';

describe('AuthorityManagementMainComponent', () => {
  let component: AuthorityManagementMainComponent;
  let fixture: ComponentFixture<AuthorityManagementMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
