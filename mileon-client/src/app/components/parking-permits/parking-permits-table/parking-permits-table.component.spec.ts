import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTableComponent } from './parking-permits-table.component';

describe('ParkingPermitsTableComponent', () => {
  let component: ParkingPermitsTableComponent;
  let fixture: ComponentFixture<ParkingPermitsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
