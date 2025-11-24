import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitDetailsRowComponent } from './parking-permit-details-row.component';

describe('ParkingPermitDetailsRowComponent', () => {
  let component: ParkingPermitDetailsRowComponent;
  let fixture: ComponentFixture<ParkingPermitDetailsRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitDetailsRowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitDetailsRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
