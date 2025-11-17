import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsSearchComponent } from './parking-permits-search.component';

describe('ParkingPermitsSearchComponent', () => {
  let component: ParkingPermitsSearchComponent;
  let fixture: ComponentFixture<ParkingPermitsSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsSearchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
