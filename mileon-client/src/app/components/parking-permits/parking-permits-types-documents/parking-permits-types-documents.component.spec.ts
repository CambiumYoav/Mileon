import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkingPermitsTypesDocumentsComponent } from './parking-permits-types-documents.component';

describe('ParkingPermitsTypesDocumentsComponent', () => {
  let component: ParkingPermitsTypesDocumentsComponent;
  let fixture: ComponentFixture<ParkingPermitsTypesDocumentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParkingPermitsTypesDocumentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParkingPermitsTypesDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
