import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureStreetsComponent } from './infrastructure-streets.component';

describe('InfrastructureStreetsComponent', () => {
  let component: InfrastructureStreetsComponent;
  let fixture: ComponentFixture<InfrastructureStreetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureStreetsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureStreetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
