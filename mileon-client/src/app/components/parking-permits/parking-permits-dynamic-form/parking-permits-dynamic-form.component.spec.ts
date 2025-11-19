import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsDynamicFormComponent } from './parking-permits-dynamic-form.component';

describe('ParkingPermitsDynamicFormComponent', () => {
  let component: ParkingPermitsDynamicFormComponent;
  let fixture: ComponentFixture<ParkingPermitsDynamicFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsDynamicFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
