import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTicketsSourceComponent } from './infrastructures-tickets-source.component';

describe('InfrastructuresTicketsSourceComponent', () => {
  let component: InfrastructuresTicketsSourceComponent;
  let fixture: ComponentFixture<InfrastructuresTicketsSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTicketsSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTicketsSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
