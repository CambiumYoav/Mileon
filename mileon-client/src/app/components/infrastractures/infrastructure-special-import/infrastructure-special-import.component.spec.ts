import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfrastructureSpecialImportComponent } from './infrastructure-special-import.component';

describe('InfrastructureSpecialImportComponent', () => {
  let component: InfrastructureSpecialImportComponent;
  let fixture: ComponentFixture<InfrastructureSpecialImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InfrastructureSpecialImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InfrastructureSpecialImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
