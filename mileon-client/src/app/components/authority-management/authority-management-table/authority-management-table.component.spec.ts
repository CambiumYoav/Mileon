import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorityManagementTableComponent } from './authority-management-table.component';

describe('AuthorityManagementTableComponent', () => {
  let component: AuthorityManagementTableComponent;
  let fixture: ComponentFixture<AuthorityManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthorityManagementTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorityManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
