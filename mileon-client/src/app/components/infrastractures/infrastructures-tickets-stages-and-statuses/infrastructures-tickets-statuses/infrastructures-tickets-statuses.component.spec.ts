import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTicketsStatusesComponent } from './infrastructures-tickets-statuses.component';

describe('InfrastructuresTicketsStatusesComponent', () => {
  let component: InfrastructuresTicketsStatusesComponent;
  let fixture: ComponentFixture<InfrastructuresTicketsStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTicketsStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTicketsStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
