import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresViolationTypesComponent } from './infrastructures-violation-types.component';

describe('InfrastructuresViolationTypesComponent', () => {
  let component: InfrastructuresViolationTypesComponent;
  let fixture: ComponentFixture<InfrastructuresViolationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresViolationTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresViolationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
