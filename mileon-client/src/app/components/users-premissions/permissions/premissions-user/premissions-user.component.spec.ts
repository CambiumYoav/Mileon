import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremissionsUserComponent } from './premissions-user.component';

describe('PremissionsUserComponent', () => {
  let component: PremissionsUserComponent;
  let fixture: ComponentFixture<PremissionsUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremissionsUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremissionsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
