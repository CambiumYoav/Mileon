import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitRequestDocumentsComponent } from './parking-permit-request-documents.component';

describe('ParkingPermitRequestDocumentsComponent', () => {
  let component: ParkingPermitRequestDocumentsComponent;
  let fixture: ComponentFixture<ParkingPermitRequestDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitRequestDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitRequestDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
