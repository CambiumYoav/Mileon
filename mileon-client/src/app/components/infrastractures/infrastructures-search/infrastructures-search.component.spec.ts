import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresSearchComponent } from './infrastructures-search.component';

describe('InfrastructuresSearchComponent', () => {
  let component: InfrastructuresSearchComponent;
  let fixture: ComponentFixture<InfrastructuresSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
