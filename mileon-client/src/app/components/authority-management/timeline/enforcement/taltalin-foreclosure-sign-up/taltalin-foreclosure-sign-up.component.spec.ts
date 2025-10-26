import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaltalinForeclosureSignUpComponent } from './taltalin-foreclosure-sign-up.component';

describe('TaltalinForeclosureSignUpComponent', () => {
  let component: TaltalinForeclosureSignUpComponent;
  let fixture: ComponentFixture<TaltalinForeclosureSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaltalinForeclosureSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaltalinForeclosureSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
