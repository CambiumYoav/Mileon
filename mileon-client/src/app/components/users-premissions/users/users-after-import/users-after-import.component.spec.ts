import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersAfterImportComponent } from './users-after-import.component';

describe('UsersAfterImportComponent', () => {
  let component: UsersAfterImportComponent;
  let fixture: ComponentFixture<UsersAfterImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersAfterImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersAfterImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
