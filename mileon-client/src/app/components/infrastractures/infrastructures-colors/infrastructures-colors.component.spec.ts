import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresColorsComponent } from './infrastructures-colors.component';

describe('InfrastructuresColorsComponent', () => {
  let component: InfrastructuresColorsComponent;
  let fixture: ComponentFixture<InfrastructuresColorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresColorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
