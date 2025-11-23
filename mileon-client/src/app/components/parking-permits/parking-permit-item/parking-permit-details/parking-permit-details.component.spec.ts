import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitDetailsComponent } from './parking-permit-details.component';

describe('ParkingPermitDetailsComponent', () => {
  let component: ParkingPermitDetailsComponent;
  let fixture: ComponentFixture<ParkingPermitDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
