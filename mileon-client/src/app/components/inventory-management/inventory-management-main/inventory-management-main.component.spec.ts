import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryManagementMainComponent } from './inventory-management-main.component';

describe('InventoryManagementMainComponent', () => {
  let component: InventoryManagementMainComponent;
  let fixture: ComponentFixture<InventoryManagementMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InventoryManagementMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryManagementMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
