import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresCitizensComponent } from './infrastructures-citizens.component';

describe('InfrastructuresCitizensComponent', () => {
  let component: InfrastructuresCitizensComponent;
  let fixture: ComponentFixture<InfrastructuresCitizensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresCitizensComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresCitizensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
