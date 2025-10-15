import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog';

import { InfrastructuresViolationsProcessTypesComponent } from './infrastructures-violations-processtypes.component';

describe('InfrastructuresViolationsProcessTypesComponent', () => {
  let component: InfrastructuresViolationsProcessTypesComponent;
  let fixture: ComponentFixture<InfrastructuresViolationsProcessTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ 
        InfrastructuresViolationsProcessTypesComponent,
        NoopAnimationsModule,
        ToastrModule.forRoot(),
        MatDialogModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructuresViolationsProcessTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
