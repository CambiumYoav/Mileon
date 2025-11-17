import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsMainComponent } from './parking-permits-main.component';

describe('ParkingPermitsMainComponent', () => {
  let component: ParkingPermitsMainComponent;
  let fixture: ComponentFixture<ParkingPermitsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
