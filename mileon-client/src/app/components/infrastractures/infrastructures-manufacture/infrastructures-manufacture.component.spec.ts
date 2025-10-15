import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresManufactureComponent } from './infrastructures-manufacture.component';

describe('InfrastructuresManufactureComponent', () => {
  let component: InfrastructuresManufactureComponent;
  let fixture: ComponentFixture<InfrastructuresManufactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresManufactureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresManufactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
