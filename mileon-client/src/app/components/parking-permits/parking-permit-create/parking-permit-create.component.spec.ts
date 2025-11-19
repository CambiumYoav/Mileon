import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitCreateComponent } from './parking-permit-create.component';

describe('ParkingPermitCreateComponent', () => {
  let component: ParkingPermitCreateComponent;
  let fixture: ComponentFixture<ParkingPermitCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
