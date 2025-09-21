import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreateNationalComponent } from './users-create-national.component';

describe('UsersCreateNationalComponent', () => {
  let component: UsersCreateNationalComponent;
  let fixture: ComponentFixture<UsersCreateNationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCreateNationalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateNationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
