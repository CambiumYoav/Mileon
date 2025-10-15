import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTicketsStagesComponent } from './infrastructures-tickets-stages.component';

describe('InfrastructuresTicketsStagesComponent', () => {
  let component: InfrastructuresTicketsStagesComponent;
  let fixture: ComponentFixture<InfrastructuresTicketsStagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTicketsStagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTicketsStagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
