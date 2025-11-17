import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsImportComponent } from './parking-permits-import.component';

describe('ParkingPermitsImportComponent', () => {
  let component: ParkingPermitsImportComponent;
  let fixture: ComponentFixture<ParkingPermitsImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsImportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
