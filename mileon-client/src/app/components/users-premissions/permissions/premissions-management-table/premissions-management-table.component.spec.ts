import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PremissionsManagementTableComponent } from './premissions-management-table.component';

describe('PremissionsManagementTableComponent', () => {
  let component: PremissionsManagementTableComponent;
  let fixture: ComponentFixture<PremissionsManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PremissionsManagementTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PremissionsManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
