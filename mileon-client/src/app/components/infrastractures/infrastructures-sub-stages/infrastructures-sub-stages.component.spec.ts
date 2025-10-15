import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresSubStagesComponent } from './infrastructures-sub-stages.component';

describe('InfrastructuresSubStagesComponent', () => {
  let component: InfrastructuresSubStagesComponent;
  let fixture: ComponentFixture<InfrastructuresSubStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresSubStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresSubStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
