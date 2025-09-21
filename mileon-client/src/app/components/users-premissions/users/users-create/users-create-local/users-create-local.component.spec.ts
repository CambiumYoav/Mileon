import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCreateLocalComponent } from './users-create-local.component';

describe('UsersCreateLocalComponent', () => {
  let component: UsersCreateLocalComponent;
  let fixture: ComponentFixture<UsersCreateLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersCreateLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersCreateLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
