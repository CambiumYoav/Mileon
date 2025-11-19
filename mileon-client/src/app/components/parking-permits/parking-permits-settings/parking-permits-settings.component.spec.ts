import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsSettingsComponent } from './parking-permits-settings.component';

describe('ParkingPermitsSettingsComponent', () => {
  let component: ParkingPermitsSettingsComponent;
  let fixture: ComponentFixture<ParkingPermitsSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsSettingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
