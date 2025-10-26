import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationAuthComponent } from './information-auth.component';

describe('InformationAuthComponent', () => {
  let component: InformationAuthComponent;
  let fixture: ComponentFixture<InformationAuthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationAuthComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
