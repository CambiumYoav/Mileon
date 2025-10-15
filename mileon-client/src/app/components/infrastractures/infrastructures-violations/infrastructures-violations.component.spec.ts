import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresViolationsComponent } from './infrastructures-violations.component';

describe('InfrastructuresViolationsComponent', () => {
  let component: InfrastructuresViolationsComponent;
  let fixture: ComponentFixture<InfrastructuresViolationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresViolationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresViolationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
