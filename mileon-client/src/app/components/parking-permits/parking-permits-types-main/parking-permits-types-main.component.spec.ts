import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesMainComponent } from './parking-permits-types-main.component';

describe('ParkingPermitsTypesMainComponent', () => {
  let component: ParkingPermitsTypesMainComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
