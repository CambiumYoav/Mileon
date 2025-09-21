import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersLocalComponent } from './users-local.component';

describe('UsersLocalComponent', () => {
  let component: UsersLocalComponent;
  let fixture: ComponentFixture<UsersLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
