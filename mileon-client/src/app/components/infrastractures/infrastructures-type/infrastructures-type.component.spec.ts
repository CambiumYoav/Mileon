import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTypeComponent } from './infrastructures-type.component';

describe('InfrastructuresTypeComponent', () => {
  let component: InfrastructuresTypeComponent;
  let fixture: ComponentFixture<InfrastructuresTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
