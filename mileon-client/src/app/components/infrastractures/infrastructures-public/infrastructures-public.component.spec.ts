import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresPublicComponent } from './infrastructures-public.component';

describe('InfrastructuresPublicComponent', () => {
  let component: InfrastructuresPublicComponent;
  let fixture: ComponentFixture<InfrastructuresPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresPublicComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
