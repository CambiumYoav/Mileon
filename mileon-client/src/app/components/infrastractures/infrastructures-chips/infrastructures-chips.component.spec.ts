import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructuresChipsComponent } from './infrastructures-chips.component';

describe('InfrastructuresChipsComponent', () => {
  let component: InfrastructuresChipsComponent;
  let fixture: ComponentFixture<InfrastructuresChipsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructuresChipsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresChipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
