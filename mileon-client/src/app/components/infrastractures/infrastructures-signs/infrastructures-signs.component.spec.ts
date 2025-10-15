import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresSignsComponent } from './infrastructures-signs.component';

describe('InfrastructuresSignsComponent', () => {
  let component: InfrastructuresSignsComponent;
  let fixture: ComponentFixture<InfrastructuresSignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresSignsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresSignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
