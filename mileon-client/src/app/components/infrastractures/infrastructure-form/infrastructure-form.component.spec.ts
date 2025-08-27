import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureFormComponent } from './infrastructure-form.component';

describe('InfrastructureFormComponent', () => {
  let component: InfrastructureFormComponent;
  let fixture: ComponentFixture<InfrastructureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
