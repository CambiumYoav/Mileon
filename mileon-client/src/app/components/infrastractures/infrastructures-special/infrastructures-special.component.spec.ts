import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresSpecialComponent } from './infrastructures-special.component';

describe('InfrastructuresSpecialComponent', () => {
  let component: InfrastructuresSpecialComponent;
  let fixture: ComponentFixture<InfrastructuresSpecialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresSpecialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresSpecialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
