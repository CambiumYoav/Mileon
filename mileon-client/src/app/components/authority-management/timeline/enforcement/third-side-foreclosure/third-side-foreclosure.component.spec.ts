import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThirdSideForeclosureComponent } from './third-side-foreclosure.component';

describe('ThirdSideForeclosureComponent', () => {
  let component: ThirdSideForeclosureComponent;
  let fixture: ComponentFixture<ThirdSideForeclosureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThirdSideForeclosureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdSideForeclosureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
