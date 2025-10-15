import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresTableComponent } from './infrastructures-table.component';

describe('InfrastructuresTableComponent', () => {
  let component: InfrastructuresTableComponent;
  let fixture: ComponentFixture<InfrastructuresTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ InfrastructuresTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
