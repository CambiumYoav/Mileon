import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaltalinForeclosureOnGoingComponent } from './taltalin-foreclosure-on-going.component';

describe('TaltalinForeclosureOnGoingComponent', () => {
  let component: TaltalinForeclosureOnGoingComponent;
  let fixture: ComponentFixture<TaltalinForeclosureOnGoingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaltalinForeclosureOnGoingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaltalinForeclosureOnGoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
