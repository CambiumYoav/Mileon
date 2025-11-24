import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitScansImportComponent } from './parking-permit-scans-import.component';

describe('ParkingPermitScansImportComponent', () => {
  let component: ParkingPermitScansImportComponent;
  let fixture: ComponentFixture<ParkingPermitScansImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitScansImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitScansImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
