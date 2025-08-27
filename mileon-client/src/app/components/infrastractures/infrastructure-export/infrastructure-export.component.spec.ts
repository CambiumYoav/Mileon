import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureExportComponent } from './infrastructure-export.component';

describe('InfrastructureExportComponent', () => {
  let component: InfrastructureExportComponent;
  let fixture: ComponentFixture<InfrastructureExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
