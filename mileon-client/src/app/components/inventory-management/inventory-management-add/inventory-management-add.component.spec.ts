import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementAddComponent } from './inventory-management-add.component';

describe('InventoryManagementAddComponent', () => {
  let component: InventoryManagementAddComponent;
  let fixture: ComponentFixture<InventoryManagementAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryManagementAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
