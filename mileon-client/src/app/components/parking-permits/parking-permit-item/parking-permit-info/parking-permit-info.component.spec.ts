import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitInfoComponent } from './parking-permit-info.component';

describe('ParkingPermitInfoComponent', () => {
  let component: ParkingPermitInfoComponent;
  let fixture: ComponentFixture<ParkingPermitInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
