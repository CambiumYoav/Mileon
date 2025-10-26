import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankForeclosureComponent } from './bank-foreclosure.component';

describe('BankForeclosureComponent', () => {
  let component: BankForeclosureComponent;
  let fixture: ComponentFixture<BankForeclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankForeclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankForeclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
