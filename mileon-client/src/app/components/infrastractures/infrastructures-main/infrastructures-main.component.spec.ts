import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { InfrastructuresMainComponent } from './infrastructures-main.component';

describe('InfrastructuresMainComponent', () => {
  let component: InfrastructuresMainComponent;
  let fixture: ComponentFixture<InfrastructuresMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        InfrastructuresMainComponent,
        RouterTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
