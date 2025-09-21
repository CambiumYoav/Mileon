import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersNationalComponent } from './users-national.component';

describe('UsersNationalComponent', () => {
  let component: UsersNationalComponent;
  let fixture: ComponentFixture<UsersNationalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersNationalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersNationalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
