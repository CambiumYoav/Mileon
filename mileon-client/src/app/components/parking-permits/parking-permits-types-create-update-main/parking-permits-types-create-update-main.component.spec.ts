import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesCreateUpdateMainComponent } from './parking-permits-types-create-update-main.component';

describe('ParkingPermitsTypesCreateUpdateMainComponent', () => {
  let component: ParkingPermitsTypesCreateUpdateMainComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesCreateUpdateMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesCreateUpdateMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesCreateUpdateMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
