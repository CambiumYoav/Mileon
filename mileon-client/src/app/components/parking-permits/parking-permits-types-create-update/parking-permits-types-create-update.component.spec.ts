import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesCreateUpdateComponent } from './parking-permits-types-create-update.component';

describe('ParkingPermitsTypesCreateUpdateComponent', () => {
  let component: ParkingPermitsTypesCreateUpdateComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesCreateUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
