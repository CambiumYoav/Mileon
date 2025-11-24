import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitCreateFlowComponent } from './parking-permit-create-flow.component';

describe('ParkingPermitCreateFlowComponent', () => {
  let component: ParkingPermitCreateFlowComponent;
  let fixture: ComponentFixture<ParkingPermitCreateFlowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitCreateFlowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitCreateFlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
