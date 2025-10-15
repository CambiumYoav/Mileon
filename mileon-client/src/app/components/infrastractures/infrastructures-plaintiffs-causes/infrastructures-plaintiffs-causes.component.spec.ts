import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresPlaintiffsCausesComponent } from './infrastructures-plaintiffs-causes.component';

describe('InfrastructuresPlaintiffsCausesComponent', () => {
  let component: InfrastructuresPlaintiffsCausesComponent;
  let fixture: ComponentFixture<InfrastructuresPlaintiffsCausesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresPlaintiffsCausesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresPlaintiffsCausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
