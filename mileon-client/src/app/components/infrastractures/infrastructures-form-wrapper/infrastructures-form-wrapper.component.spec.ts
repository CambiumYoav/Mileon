import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresFormWrapperComponent } from './infrastructures-form-wrapper.component';

describe('InfrastructuresFormWrapperComponent', () => {
  let component: InfrastructuresFormWrapperComponent;
  let fixture: ComponentFixture<InfrastructuresFormWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresFormWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresFormWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
