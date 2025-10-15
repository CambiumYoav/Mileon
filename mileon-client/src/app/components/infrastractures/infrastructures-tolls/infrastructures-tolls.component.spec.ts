import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTollsComponent } from './infrastructures-tolls.component';

describe('InfrastructuresTollsComponent', () => {
  let component: InfrastructuresTollsComponent;
  let fixture: ComponentFixture<InfrastructuresTollsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresTollsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
