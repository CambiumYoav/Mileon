import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleForeclosureOnGoingComponent } from './vehicle-foreclosure-on-going.component';

describe('VehicleForeclosureOnGoingComponent', () => {
  let component: VehicleForeclosureOnGoingComponent;
  let fixture: ComponentFixture<VehicleForeclosureOnGoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehicleForeclosureOnGoingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleForeclosureOnGoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
