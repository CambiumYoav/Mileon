import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresDisabledComponent } from './infrastructures-disabled.component';

describe('InfrastructuresDisabledComponent', () => {
  let component: InfrastructuresDisabledComponent;
  let fixture: ComponentFixture<InfrastructuresDisabledComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresDisabledComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresDisabledComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
