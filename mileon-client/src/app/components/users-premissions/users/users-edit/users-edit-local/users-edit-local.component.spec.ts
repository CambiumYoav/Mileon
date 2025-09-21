import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEditLocalComponent } from './users-edit-local.component';

describe('UsersEditLocalComponent', () => {
  let component: UsersEditLocalComponent;
  let fixture: ComponentFixture<UsersEditLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersEditLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
