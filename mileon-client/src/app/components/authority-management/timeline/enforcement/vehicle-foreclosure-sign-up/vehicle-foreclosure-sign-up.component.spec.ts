import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleForeclosureSignUpComponent } from './vehicle-foreclosure-sign-up.component';

describe('VehicleForeclosureSignUpComponent', () => {
  let component: VehicleForeclosureSignUpComponent;
  let fixture: ComponentFixture<VehicleForeclosureSignUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleForeclosureSignUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleForeclosureSignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
