import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureImportComponent } from './infrastructure-import.component';

describe('InfrastructureImportComponent', () => {
  let component: InfrastructureImportComponent;
  let fixture: ComponentFixture<InfrastructureImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
