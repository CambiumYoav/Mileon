import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementTableComponent } from './inventory-management-table.component';

describe('InventoryManagementTableComponent', () => {
  let component: InventoryManagementTableComponent;
  let fixture: ComponentFixture<InventoryManagementTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryManagementTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
