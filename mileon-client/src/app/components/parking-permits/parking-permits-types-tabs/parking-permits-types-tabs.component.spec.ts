import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesTabsComponent } from './parking-permits-types-tabs.component';

describe('ParkingPermitsTypesTabsComponent', () => {
  let component: ParkingPermitsTypesTabsComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesTabsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
