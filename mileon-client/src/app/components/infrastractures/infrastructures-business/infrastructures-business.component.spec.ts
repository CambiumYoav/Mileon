import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresBusinessComponent } from './infrastructures-business.component';

describe('InfrastructuresBusinessComponent', () => {
  let component: InfrastructuresBusinessComponent;
  let fixture: ComponentFixture<InfrastructuresBusinessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresBusinessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
