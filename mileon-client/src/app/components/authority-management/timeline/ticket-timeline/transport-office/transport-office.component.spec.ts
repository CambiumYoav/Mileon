import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportOfficeComponent } from './transport-office.component';

describe('TransportOfficeComponent', () => {
  let component: TransportOfficeComponent;
  let fixture: ComponentFixture<TransportOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransportOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
