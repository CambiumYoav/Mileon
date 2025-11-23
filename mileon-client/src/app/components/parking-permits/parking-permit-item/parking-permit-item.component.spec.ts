import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitItemComponent } from './parking-permit-item.component';

describe('ParkingPermitItemComponent', () => {
  let component: ParkingPermitItemComponent;
  let fixture: ComponentFixture<ParkingPermitItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
