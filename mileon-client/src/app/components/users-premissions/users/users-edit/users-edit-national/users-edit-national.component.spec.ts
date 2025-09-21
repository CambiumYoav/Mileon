import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersEditNationalComponent } from './users-edit-national.component';

describe('UsersEditNationalComponent', () => {
  let component: UsersEditNationalComponent;
  let fixture: ComponentFixture<UsersEditNationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersEditNationalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditNationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
