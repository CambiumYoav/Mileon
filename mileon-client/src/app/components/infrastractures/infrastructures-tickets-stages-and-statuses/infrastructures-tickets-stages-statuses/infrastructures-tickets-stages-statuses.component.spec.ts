import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTicketsStagesStatusesComponent } from './infrastructures-tickets-stages-statuses.component';

describe('InfrastructuresTicketsStagesStatusesComponent', () => {
  let component: InfrastructuresTicketsStagesStatusesComponent;
  let fixture: ComponentFixture<InfrastructuresTicketsStagesStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTicketsStagesStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTicketsStagesStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
