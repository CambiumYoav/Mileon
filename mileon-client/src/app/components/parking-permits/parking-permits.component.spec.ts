import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsComponent } from './parking-permits.component';

describe('ParkingPermitsComponent', () => {
  let component: ParkingPermitsComponent;
  let fixture: ComponentFixture<ParkingPermitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
