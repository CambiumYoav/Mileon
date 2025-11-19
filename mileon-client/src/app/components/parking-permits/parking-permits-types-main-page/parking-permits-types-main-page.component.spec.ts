import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesMainPageComponent } from './parking-permits-types-main-page.component';

describe('ParkingPermitsTypesMainPageComponent', () => {
  let component: ParkingPermitsTypesMainPageComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesMainPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesMainPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesMainPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
