import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementEditComponent } from './inventory-management-edit.component';

describe('InventoryManagementEditComponent', () => {
  let component: InventoryManagementEditComponent;
  let fixture: ComponentFixture<InventoryManagementEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryManagementEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
