import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTicketsSourceTableComponent } from './infrastructures-tickets-source-table.component';

describe('InfrastructuresTicketsSourceTableComponent', () => {
  let component: InfrastructuresTicketsSourceTableComponent;
  let fixture: ComponentFixture<InfrastructuresTicketsSourceTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTicketsSourceTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTicketsSourceTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
